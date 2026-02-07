# Prompt 11: AI Assistant Integration (Chatbot)

---

## [MESSAGE 1: IGNITION]

### Task
Implement the conversational interface that can trigger hotel searches.

### Requirements
- **Prompting**: Use the `prompts/chatbot_specialist.md` for the system context.
- **Skills**: Implement the bridge between OpenAI Function Calling and the `SearchOrchestrator`.
- **Streaming**: Stream GPT's responses to the frontend using Server-Sent Events (SSE) or WebSockets.
- **UI**: Build the "floating assistant" chat widget with support for "searching..." states and rich results within the chat.

### Output
A functional AI chatbot that allows users to find hotels via natural language conversation.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the GPT tool-calling logic correctly connects to the Search Orchestrator.
