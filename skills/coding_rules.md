# 💻 Coding Rules & Engineering Skills

> This document defines the "Engineering Skill" of the WinWin Travel project. It acts as the technical governance for all code generation, refactoring, and architectural decisions.

---

## 1. Architectural Integrity

- **Layer Isolation**: (L1-L6) No cross-contamination. Orchestrators must not speak directly to the DB without a Service or Repository.
- **Adapter Standard**: Every integration MUST implement the `IntegrationAdapter` interface. No ad-hoc API call implementations allowed.
- **DTO Mandatory**: All data passing through the "Internal Bridge" (Backend to Frontend) MUST use defined TypeScript interfaces. Never return raw JSON or Provider data.

---

## 2. Robustness & Reliability

- **Graceful Partial Failure**: If one Provider (e.g., Booking.com) is down, the search MUST continue with others.
- **Price Locking**: Never initiate a reservation without a verified Redis-backed price lock (5-minute TTL).
- **Atomic Bookings**: All booking state changes MUST use Prisma `$transaction` blocks to ensure DB consistency during provider confirmation.
- **Error Classification**: Use `IntegrationError` classes to distinguish between transient (retryable) and permanent (non-retryable) failures.

---

## 3. AI & Data Intelligence

- **Pruning Strategy**: Candidates > 100 MUST be pruned using Stage-1 (Heuristic) before Stage-2 (Neural) ranking occurs.
- **Real-time Drift**: User profile embeddings MUST be updated incrementally after every "LIKE" or "DISLIKE" using the momentum-based logic in `ai_layer_algorithms.md`.
- **Chat Extractor**: The GPT Intent Extractor MUST always normalize dates to ISO format relative to the `current_system_time`.

---

## 4. Frontend & UX Standards

- **Server-First (RSC)**: Favor React Server Components for performance. Client components (`'use client'`) are strictly for interactive leaf nodes (buttons, maps).
- **Optimism**: All reactions (Like/Dislike) MUST use TanStack Query mutations for immediate visual feedback before the server confirms.
- **The "WOW" Factor**: Use HSL-tailored colors, smooth Framer Motion transitions, and consistent glassmorphism tokens as defined in the `frontend_implementation.md` guide.

---

## 5. Deployment & Ops

- **Zero Hand-waving**: Every environment variable in `.env.example` is mandatory.
- **Log Hygiene**: Use structured JSON logging (Pino). No `console.log` in production-ready files.
- **Checklist Compliance**: No code is "Done" until it passes the Verification Checklist in its respective Implementation Guide.
