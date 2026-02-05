import { useState, useEffect } from 'react';
import { sendToPowerAutomate, createServiceNowTicket, sendFeedback } from '../services/chatService';
import { Message, Role } from '../types';

export const useChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: Role.MODEL,
            text: 'Olá! Sou o assistente virtual da **Winprovit**. Como posso ajudar a melhorar os seus processos ou resolver um problema hoje?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ url: string; file: File } | null>(null);

    // State for retry logic (3 attempts before escalation)
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lastUserRequest, setLastUserRequest] = useState<{ text: string, image?: string } | null>(null);

    // State for pending escalation (waiting for nr_loja/nr_pos)
    const [pendingEscalation, setPendingEscalation] = useState<{
        shortDescription: string;
        description: string;
        conversationHistory: string;
    } | null>(null);

    // Clean up ObjectURL on unmount or when image changes
    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage.url);
            }
        };
    }, [selectedImage]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setSelectedImage({ url, file });
            e.target.value = '';
        }
    };

    const clearImage = () => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage.url);
            setSelectedImage(null);
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const currentInput = input;
        const currentImage = selectedImage;

        setInput('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            let base64Image = undefined;
            if (currentImage) {
                base64Image = await convertFileToBase64(currentImage.file);
                URL.revokeObjectURL(currentImage.url);
            }

            const userMessage: Message = {
                id: Date.now().toString(),
                role: Role.USER,
                text: currentInput,
                image: base64Image,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);

            // Check if we have a pending escalation (waiting for nr_loja/nr_pos)
            if (pendingEscalation) {
                const statusId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, {
                    id: statusId,
                    role: Role.MODEL,
                    text: 'A processar dados e criar ticket...',
                    timestamp: new Date(),
                    isStatusMessage: true,
                    statusType: 'loading'
                }]);

                try {
                    const ticketResult = await createServiceNowTicket({
                        ...pendingEscalation,
                        userResponse: currentInput,
                        priority: 'medium',
                        category: 'Technical Support'
                    });

                    setMessages(p => {
                        const filtered = p.filter(m => m.id !== statusId);

                        if (ticketResult.success) {
                            return [...filtered, {
                                id: (Date.now() + 2).toString(),
                                role: Role.MODEL,
                                text: `Ticket ServiceNow Criado com Sucesso!\n\nO seu caso foi escalado para um técnico humano.\n\n**Número do Ticket:** \`${ticketResult.ticketNumber}\`\n\nSerá contactado em breve através do email associado à sua conta.`,
                                timestamp: new Date(),
                                statusType: 'success'
                            }];
                        } else if (ticketResult.needsMoreInfo) {
                            return [...filtered, {
                                id: (Date.now() + 2).toString(),
                                role: Role.MODEL,
                                text: ticketResult.message || 'Por favor, forneça os dados em falta.',
                                timestamp: new Date(),
                                statusType: 'warning'
                            }];
                        } else {
                            return [...filtered, {
                                id: (Date.now() + 2).toString(),
                                role: Role.MODEL,
                                text: `Ocorreu um erro ao criar o ticket. Por favor, tente novamente.`,
                                timestamp: new Date(),
                                statusType: 'error'
                            }];
                        }
                    });

                    if (ticketResult.success) {
                        setPendingEscalation(null);
                        setFailedAttempts(0);
                        setLastUserRequest(null);
                    }
                } catch (error) {
                    console.error('Error creating ticket with data:', error);
                    setMessages(p => {
                        const filtered = p.filter(m => m.id !== statusId);
                        return [...filtered, {
                            id: (Date.now() + 2).toString(),
                            role: Role.MODEL,
                            text: 'Ocorreu um erro. Por favor, tente novamente.',
                            timestamp: new Date(),
                            statusType: 'error'
                        }];
                    });
                }
            } else {
                // Normal flow - save context for potential retry
                setLastUserRequest({
                    text: currentInput,
                    image: base64Image
                });
                setFailedAttempts(0);

                const statusId = (Date.now() + 1).toString();
                const statusMessage: Message = {
                    id: statusId,
                    role: Role.MODEL,
                    text: currentImage
                        ? 'A analisar a imagem e a procurar solução...'
                        : 'A procurar solução...',
                    timestamp: new Date(),
                    isStatusMessage: true,
                    statusType: 'loading'
                };
                setMessages(prev => [...prev, statusMessage]);

                const result = await sendToPowerAutomate({
                    history: messages,
                    prompt: currentInput || (currentImage ? "Analise esta imagem de erro técnico." : "Olá"),
                    imageBase64: base64Image
                });

                setMessages(prev => {
                    const filtered = prev.filter(m => m.id !== statusId);
                    const botMessage: Message = {
                        id: (Date.now() + 2).toString(),
                        role: Role.MODEL,
                        text: result.response,
                        timestamp: new Date(),
                        hasFeedback: result.success
                    };
                    return [...filtered, botMessage];
                });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const filtered = prev.filter(m => !m.isStatusMessage);
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: Role.MODEL,
                    text: "Peço desculpa, mas ocorreu um erro temporário. Pode tentar novamente?",
                    timestamp: new Date(),
                    statusType: 'error'
                };
                return [...filtered, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = async (messageId: string, wasHelpful: boolean) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, feedbackGiven: wasHelpful ? 'yes' : 'no' };
            }
            return msg;
        }));

        // Send feedback to Power Automate (fire and forget)
        sendFeedback(messageId, wasHelpful);

        if (wasHelpful) {
            setFailedAttempts(0);
            setLastUserRequest(null);
        } else {
            const currentAttempts = failedAttempts + 1;
            setFailedAttempts(currentAttempts);

            if (currentAttempts < 3 && lastUserRequest) {
                // RETRY LOGIC
                setTimeout(async () => {
                    setIsLoading(true);

                    const statusId = (Date.now() + 1).toString();

                    setMessages(prev => [
                        ...prev,
                        {
                            id: statusId,
                            role: Role.MODEL,
                            text: `Entendido. Vou procurar uma solução alternativa... (Tentativa ${currentAttempts + 1}/3)`,
                            timestamp: new Date(),
                            isStatusMessage: true,
                            statusType: 'loading'
                        }
                    ]);

                    try {
                        const retryPrompt = `CONTEXTO: O utilizador indicou que a solução anterior NÃO funcionou. TENTATIVA ${currentAttempts + 1} de 3. PROBLEMA: ${lastUserRequest.text}. Apresenta uma solução DIFERENTE.`;

                        const result = await sendToPowerAutomate({
                            history: messages,
                            prompt: retryPrompt,
                            imageBase64: lastUserRequest.image
                        });

                        setMessages(prev => {
                            const filtered = prev.filter(m => m.id !== statusId);
                            return [...filtered, {
                                id: (Date.now() + 2).toString(),
                                role: Role.MODEL,
                                text: result.response,
                                timestamp: new Date(),
                                hasFeedback: true
                            }];
                        });

                    } catch (error) {
                        console.error("Retry failed:", error);
                        setMessages(prev => prev.filter(m => m.id !== statusId));
                    } finally {
                        setIsLoading(false);
                    }
                }, 800);

            } else {
                // ESCALATION LOGIC
                const handleEscalation = async () => {
                    const conversationHistory = messages
                        .filter(m => !m.isStatusMessage)
                        .map(m => `${m.role === Role.USER ? 'Utilizador' : 'Bot'}: ${m.text}`)
                        .join('\n');

                    const ticketData = {
                        shortDescription: `Suporte: ${lastUserRequest?.text?.substring(0, 100) || 'Problema técnico não resolvido'}`,
                        description: `O utilizador reportou um problema que não foi resolvido após 3 tentativas automáticas.\n\nProblema original: ${lastUserRequest?.text || 'N/A'}`,
                        conversationHistory: conversationHistory
                    };

                    const loadingId = Date.now().toString();
                    setMessages(p => [...p, {
                        id: loadingId,
                        role: Role.MODEL,
                        text: 'A criar ticket de suporte...',
                        timestamp: new Date(),
                        isStatusMessage: true,
                        statusType: 'loading'
                    }]);

                    try {
                        const ticketResult = await createServiceNowTicket({
                            ...ticketData,
                            priority: 'medium',
                            category: 'Technical Support'
                        });

                        setMessages(p => p.filter(m => m.id !== loadingId));

                        if (ticketResult.success) {
                            setMessages(p => [...p, {
                                id: (Date.now() + 1).toString(),
                                role: Role.MODEL,
                                text: `Ticket ServiceNow Criado com Sucesso!\n\nO seu caso foi escalado para um técnico humano.\n\n**Número do Ticket:** \`${ticketResult.ticketNumber}\`\n\nSerá contactado em breve através do email associado à sua conta.`,
                                timestamp: new Date(),
                                statusType: 'success'
                            }]);
                            setFailedAttempts(0);
                            setLastUserRequest(null);
                            setPendingEscalation(null);
                        } else if (ticketResult.needsMoreInfo) {
                            setPendingEscalation(ticketData);
                            setMessages(p => [...p, {
                                id: (Date.now() + 1).toString(),
                                role: Role.MODEL,
                                text: ticketResult.message || 'Para criar o ticket, preciso de mais alguns dados. Por favor, forneça o número da loja e o número do POS.',
                                timestamp: new Date(),
                                statusType: 'warning'
                            }]);
                        } else {
                            setMessages(p => [...p, {
                                id: (Date.now() + 1).toString(),
                                role: Role.MODEL,
                                text: `Lamentamos que a solução não tenha funcionado após várias tentativas.\n\nO seu caso foi registado para análise por um técnico humano. Será contactado em breve.\n\n*Referência: #${Date.now().toString().slice(-6)}*`,
                                timestamp: new Date(),
                                statusType: 'info'
                            }]);
                            setFailedAttempts(0);
                            setLastUserRequest(null);
                        }
                    } catch (error) {
                        console.error('Escalation error:', error);
                        setMessages(p => {
                            const filtered = p.filter(m => m.id !== loadingId);
                            return [...filtered, {
                                id: (Date.now() + 1).toString(),
                                role: Role.MODEL,
                                text: `Lamentamos que a solução não tenha funcionado.\n\nOcorreu um erro ao criar o ticket, mas o seu caso foi registado.\n\n*Referência: #${Date.now().toString().slice(-6)}*`,
                                timestamp: new Date(),
                                statusType: 'error'
                            }];
                        });
                        setFailedAttempts(0);
                        setLastUserRequest(null);
                    }
                };

                setTimeout(handleEscalation, 500);
            }
        }
    };

    return {
        messages,
        input,
        setInput,
        isLoading,
        selectedImage,
        handleImageSelect,
        clearImage,
        handleSend,
        handleFeedback
    };
};
