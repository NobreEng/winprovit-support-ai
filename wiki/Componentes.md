# Componentes

## App.tsx

Componente raiz que compõe a interface:

```tsx
export default function App() {
  const { messages, input, ... } = useChat();
  
  return (
    <div>
      <ChatHeader />
      <main>{messages.map(m => <MessageBubble ... />)}</main>
      <ChatInput ... />
    </div>
  );
}
```

---

## useChat.ts

Custom hook com toda a lógica de estado:

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `messages` | `Message[]` | Histórico de mensagens |
| `input` | `string` | Texto atual |
| `isLoading` | `boolean` | A processar? |
| `selectedImage` | `{url, file}` | Imagem anexada |
| `failedAttempts` | `number` | Tentativas falhadas (0-3) |
| `pendingEscalation` | `object` | Dados para ticket |

---

## chatService.ts

Serviço de comunicação com Power Automate:

| Função | Descrição |
|--------|-----------|
| `sendToPowerAutomate()` | Envia mensagem do utilizador |
| `createServiceNowTicket()` | Cria ticket de escalação |
| `sendFeedback()` | Envia feedback (sim/não) |

---

## Componentes Visuais

| Componente | Função |
|------------|--------|
| `ChatHeader` | Logo + título fixo no topo |
| `ChatInput` | Textarea + anexar imagem + enviar |
| `MessageBubble` | Bolha estilizada com feedback |
