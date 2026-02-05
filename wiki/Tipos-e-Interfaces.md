# Tipos e Interfaces

## types.ts

### Enum Role

```typescript
export enum Role {
  USER = 'user',
  MODEL = 'model'
}
```

### Interface Message

```typescript
export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackGiven?: 'yes' | 'no';
  isStatusMessage?: boolean;
  statusType?: 'loading' | 'success' | 'error' | 'warning' | 'info';
}
```

### Descrição dos Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | ✅ | Identificador único |
| `role` | `Role` | ✅ | Quem enviou (user/model) |
| `text` | `string` | ✅ | Conteúdo da mensagem |
| `image` | `string` | ❌ | URL da imagem anexada |
| `timestamp` | `Date` | ✅ | Data/hora da mensagem |
| `hasFeedback` | `boolean` | ❌ | Mostra botões Sim/Não? |
| `feedbackGiven` | `'yes' \| 'no'` | ❌ | Feedback já dado |
| `isStatusMessage` | `boolean` | ❌ | É mensagem de status? |
| `statusType` | `string` | ❌ | Tipo de status visual |
