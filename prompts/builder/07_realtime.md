# Prompt 7: Real-time Gateway (WebSockets)

---

## [MESSAGE 1: IGNITION]

### Task
Set up the `Socket.io` server and handle real-time event broadcasting.

### Requirements
- **Server**: Implement `realtime-gateway.ts` with the Redis Adapter.
- **Rooms**: Implement room-based subscriptions (`user:{id}`, `hotel:{id}`).
- **Streaming**: Update the Search Orchestrator to emit `search:partial_results` to the socket as each provider responds.
- **Price Alerts**: Broadcast price/availability changes to all users viewing a specific property.
- **Auth**: Implement JWT-based handshake authentication for the socket connection.

### Output
A live-updating platform where results appear progressively and prices update in real-time.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the Redis Adapter for Socket.io is correctly configured for scaling.
