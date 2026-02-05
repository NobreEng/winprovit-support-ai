<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Winprovit Support AI

🤖 **Chatbot de suporte técnico com IA integrada**

## Stack

| Categoria | Tecnologia |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Backend** | Power Automate |
| **IA** | Gemini AI |
| **Ticketing** | ServiceNow |
| **PWA** | Service Worker |

## Features

- 💬 Interface de chat moderna e responsiva
- 🔄 Sistema de retry inteligente (3 tentativas)
- 🎫 Escalação automática para tickets ServiceNow
- 📱 PWA (instalável no telemóvel)
- 🖼️ Suporte para anexar imagens

## Arquitetura

```
Frontend (React) → Power Automate → Gemini AI
                                  → ServiceNow
```

O frontend é apenas uma UI de chat. Toda a lógica de IA e integração está no Power Automate.

## Instalação

```bash
npm install
npm run dev
```

## Variáveis de Ambiente

```env
VITE_POWER_AUTOMATE_URL=https://...
VITE_POWER_AUTOMATE_ESCALATION_URL=...
```

## Documentação

📚 Consulte a [Wiki](../../wiki) para documentação técnica completa.

---

Desenvolvido para **Winprovit**
