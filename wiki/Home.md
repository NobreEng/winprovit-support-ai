# Winprovit Support AI — Documentação Técnica

> Chatbot de Suporte Técnico que comunica com Power Automate

## Índice

- [[Arquitetura]]
- [[Estrutura de Pastas]]
- [[Componentes]]
- [[Fluxo de Mensagem]]
- [[Tipos e Interfaces]]

---

## Visão Geral

**Princípio**: O frontend é apenas uma UI de chat. Toda a lógica de IA e integração está no Power Automate.

### Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS (CDN) |
| **Icons** | Lucide React |
| **Backend** | Power Automate |
| **PWA** | Service Worker |

## Variáveis de Ambiente

```env
# .env.local
VITE_POWER_AUTOMATE_URL=https://...      # Webhook principal
VITE_POWER_AUTOMATE_ESCALATION_URL=...   # Webhook para tickets
```
