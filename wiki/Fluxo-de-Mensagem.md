# Fluxo de Mensagem

## Diagrama de Sequência

```mermaid
sequenceDiagram
    actor User
    participant useChat
    participant chatService
    participant PowerAutomate

    User->>useChat: Escreve "O POS dá erro"
    useChat->>useChat: Mostra "A procurar..."
    useChat->>chatService: sendToPowerAutomate()
    chatService->>PowerAutomate: POST {userMessage, history}
    PowerAutomate-->>chatService: {resposta: "..."}
    chatService-->>useChat: {response, success}
    useChat-->>User: Mostra resposta + botões Sim/Não
```

---

## Sistema de Retry

```
Utilizador clica "Não ajudou"
    └── failedAttempts < 3?
        ├── SIM → Envia retry ao Power Automate
        └── NÃO → Escala para ServiceNow
            └── Power Automate cria ticket
```

### Lógica de Escalação

1. Utilizador recebe resposta
2. Clica "Não ajudou"
3. `failedAttempts` incrementa
4. Se `failedAttempts >= 3`:
   - Mostra formulário de escalação
   - Utilizador preenche dados (loja, POS, descrição)
   - Power Automate cria ticket no ServiceNow
5. Se `failedAttempts < 3`:
   - Nova tentativa com contexto adicional
