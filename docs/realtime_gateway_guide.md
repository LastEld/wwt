# 🌐 Real-time Gateway Guide

> Technical implementation details for the WinWin Travel WebSocket infrastructure, powered by Socket.io.

---

## 1. Gateway Architecture

The Real-time Gateway (Layer 6) serves as the bidirectional bridge between the user and our microservices.

### Tech Stack
- **Server**: Socket.io (Node.js)
- **Scaling**: Redis Adapter (for multi-instance sync)
- **Security**: JWT-based handshake authentication

---

## 2. Event Lifecycle

### Handshake & Auth
Every connection must be authenticated during the handshake to prevent unauthorized event listening.

```typescript
// src/services/realtime/realtime-gateway.ts
const io = new Server(httpServer);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});
```

### Protocol: Pub/Sub Rooms
We use rooms to isolate event traffic:
- `user:{id}`: Private notifications (Price alerts, booking confirmations).
- `search:{id}`: Partial result updates from the Orchestrator.
- `hotel:{id}`: Global availability alerts for specific properties.

---

## 3. Core Implementation Hints

### Real-time Pricing Updates
When the Pricing Service detects a change, it broadcasts to all users currently viewing that hotel.

```typescript
function broadcastPriceUpdate(hotelId: string, newPrice: number) {
  io.to(`hotel:${hotelId}`).emit('price:update', {
    hotelId,
    newPrice,
    timestamp: Date.now()
  });
}
```

### Low-Latency Chat
Integrating the AI Chatbot via WebSockets for a seamless "typing..." experience.

```typescript
socket.on('chat:message', async (text) => {
  socket.emit('chat:status', 'typing');
  
  const response = await aiMatchingService.processChat(text, socket.data.user.id);
  
  socket.emit('chat:response', response);
});
```

---

## 4. Performance & Scaling

### Redis Adapter
To support horizontal scaling, we use the Redis Adapter. This ensures that an event emitted on Server A reaches a client connected to Server B.

```typescript
import { createAdapter } from "@socket.io/redis-adapter";
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Rate Limiting (Event-Based)
Use a sliding window rate limiter on incoming socket events to prevent spamming the GPT API or Search Orchestrator.

---

## 5. Client Integration (Next.js)

```tsx
// src/hooks/useSocket.ts
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token: getAuthToken() }
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  return socket;
};
```
