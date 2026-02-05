import { Message, Role } from '../types';

// Power Automate Integration
const POWER_AUTOMATE_URL = import.meta.env.VITE_POWER_AUTOMATE_URL;
const POWER_AUTOMATE_ESCALATION_URL = import.meta.env.VITE_POWER_AUTOMATE_ESCALATION_URL;

/**
 * Ticket data structure for ServiceNow escalation
 */
export interface ServiceNowTicketData {
    shortDescription: string;
    description: string;
    conversationHistory: string;
    userEmail?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    category?: string;
    userResponse?: string;
}

/**
 * Result from ServiceNow ticket creation attempt
 */
export interface ServiceNowTicketResult {
    success: boolean;
    ticketNumber: string | null;
    error?: string;
    needsMoreInfo?: boolean;
    message?: string;
}

/**
 * Format message history as a text string for context
 */
const formatHistoryForContext = (messages: Message[]): string => {
    const conversationParts: string[] = [];

    for (const msg of messages) {
        if (msg.isStatusMessage || !msg.text) continue;
        const roleLabel = msg.role === Role.USER ? 'User' : 'Bot';
        conversationParts.push(`${roleLabel}: ${msg.text}`);
    }

    return conversationParts.join('\n');
};

/**
 * Send a chat message to Power Automate
 */
export const sendToPowerAutomate = async ({
    history,
    prompt,
    imageBase64,
}: {
    history: Message[];
    prompt: string;
    imageBase64?: string;
}): Promise<{ response: string; success: boolean }> => {
    if (!POWER_AUTOMATE_URL) {
        console.error("Power Automate URL not configured");
        return { response: "Erro de configuração. Por favor, contacte o suporte.", success: false };
    }

    try {
        const conversationId = `conv_${Date.now()}`;

        // Strip the data:image/xxx;base64, prefix if present
        let cleanBase64 = "";
        if (imageBase64) {
            cleanBase64 = imageBase64.includes(',')
                ? imageBase64.split(',')[1]
                : imageBase64;
        }

        const historyString = formatHistoryForContext(history);

        const payload = {
            userMessage: prompt,
            imageBase64: cleanBase64,
            imageName: cleanBase64 ? `screenshot_${Date.now()}.png` : undefined,
            conversationId: conversationId,
            history: historyString
        };

        console.log("Sending to Power Automate:", conversationId);

        const response = await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Power Automate error: ${response.status}`);
        }

        const data = await response.json();
        return {
            response: data.resposta || data.response || data.text || "Resposta recebida.",
            success: true
        };
    } catch (error) {
        console.error("Power Automate error:", error);
        return { response: "Erro ao comunicar com o servidor. Por favor, tente novamente.", success: false };
    }
};

/**
 * Create a ServiceNow ticket via Power Automate (escalation)
 */
export const createServiceNowTicket = async (
    ticketData: ServiceNowTicketData
): Promise<ServiceNowTicketResult> => {
    const escalationUrl = POWER_AUTOMATE_ESCALATION_URL || POWER_AUTOMATE_URL;

    if (!escalationUrl) {
        console.warn("No escalation URL configured");
        return {
            success: false,
            ticketNumber: null,
            error: "Escalation endpoint not configured"
        };
    }

    try {
        const payload = {
            action: "createTicket",
            shortDescription: ticketData.shortDescription,
            description: ticketData.description,
            history: ticketData.conversationHistory,
            text: ticketData.userResponse || "",
            userEmail: ticketData.userEmail || "",
            priority: ticketData.priority || "medium",
            category: ticketData.category || "Technical Support",
            timestamp: new Date().toISOString()
        };

        console.log("Creating ServiceNow ticket via Power Automate");

        const response = await fetch(escalationUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Escalation error: ${response.status}`);
        }

        const data = await response.json();

        // Check if Power Automate is asking for missing fields
        if (data.success === false || data.missingFields === true) {
            return {
                success: false,
                ticketNumber: null,
                needsMoreInfo: true,
                message: data.resposta || "Por favor, forneça os dados em falta."
            };
        }

        const ticketNumber = data.ticketNumber || data.sys_id || data.number || data.incident_number || null;

        if (!ticketNumber && data.resposta && !data.success) {
            return {
                success: false,
                ticketNumber: null,
                needsMoreInfo: true,
                message: data.resposta
            };
        }

        return {
            success: true,
            ticketNumber: ticketNumber || `INC${Date.now().toString().slice(-8)}`,
            message: data.resposta
        };
    } catch (error) {
        console.error("Failed to create ServiceNow ticket:", error);
        return {
            success: false,
            ticketNumber: null,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};

/**
 * Send feedback to Power Automate (optional)
 */
export const sendFeedback = async (messageId: string, wasHelpful: boolean): Promise<void> => {
    if (!POWER_AUTOMATE_URL) return;

    try {
        await fetch(POWER_AUTOMATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "feedback",
                messageId,
                wasHelpful,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error("Failed to send feedback:", error);
    }
};
