# 🚀 Scalability & Performance Guide

> Engineering for high traffic and system growth.

---

## 1. Horizontal Scaling

The platform is designed to be stateless, allowing it to scale across multiple Kubernetes pods or Serverless instances.

- **WebSockets**: Use the **Redis Adapter** for Socket.io to sync events across instances.
- **Sessions**: Store all session data in Redis, not in application memory.
- **Image Processing**: Use a CDN (e.g., Cloudinary or Imgix) for hotel images to offload bandwidth.

---

## 2. Database Optimization (PostgreSQL)

### Connection Pooling
Use **Prisma Accelerate** or **pgBouncer** to manage a large number of concurrent connections efficiently.

### Index Maintenance
Regularly re-index the `Reaction` and `SearchHistory` tables as they grow into millions of rows.

---

## 3. Intelligent Caching

### Layered Cache Strategy
1.  **L1: Browser Cache**: Cache static assets and static hotel details (24h).
2.  **L2: Redis (Global)**: Centralized store for price locks and search results (1-15m).
3.  **L3: CDN**: Edge-cached results for popular searches (e.g., "Paris" during Olympics).

---

## 4. Background Job Management (BullMQ)

Offload heavy tasks to background workers to keep the main thread responsive.

| Task | Queue | Strategy |
|------|-------|----------|
| **Price Refresh** | `high-priority` | Run for hotels with active concurrent viewers. |
| **Email/SMS** | `default` | Send booking confirmations. |
| **AI Feature Sync**| `low-priority` | Re-calculate user embeddings after multiple reactions. |

---

## 5. Cold Boot & Deployment Tips

- **Next.js ISR (Incremental Static Regeneration)**: Use for hotel detail pages that don't change prices every second.
- **Docker Multi-Stage Builds**: Keep your production image size < 200MB for faster deployments.
