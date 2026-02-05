# Estrutura de Pastas

```
winprovit-support-ai/
├── App.tsx                 # Componente principal
├── index.tsx               # Entry point
├── index.html              # HTML + Tailwind config
├── types.ts                # Tipos TypeScript
├── vite.config.ts          # Config Vite
│
├── components/
│   ├── ChatHeader.tsx      # Cabeçalho com logo
│   ├── ChatInput.tsx       # Input + botão enviar
│   ├── MessageBubble.tsx   # Bolha de mensagem
│   └── Logo.tsx            # Logo Winprovit
│
├── hooks/
│   └── useChat.ts          # Estado e lógica do chat
│
├── services/
│   └── chatService.ts      # Comunicação com Power Automate
│
└── public/
    ├── manifest.json       # PWA
    └── sw.js               # Service Worker
```

## Descrição dos Ficheiros

### Raiz

| Ficheiro | Descrição |
|----------|-----------|
| `App.tsx` | Componente React principal |
| `index.tsx` | Entry point da aplicação |
| `types.ts` | Definições de tipos TypeScript |
| `vite.config.ts` | Configuração do Vite |

### /components

| Componente | Função |
|------------|--------|
| `ChatHeader` | Logo + título fixo no topo |
| `ChatInput` | Textarea + anexar imagem + enviar |
| `MessageBubble` | Bolha estilizada com feedback |
| `Logo` | Logo Winprovit SVG |

### /hooks

| Hook | Descrição |
|------|-----------|
| `useChat` | Custom hook com estado e lógica do chat |

### /services

| Serviço | Descrição |
|---------|-----------|
| `chatService` | Comunicação HTTP com Power Automate |
