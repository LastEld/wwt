# WinWin Travel

**Project Type:** Next.js 14 Travel Platform
**Version:** 0.1.0
**Status:** Active Development

## Overview

WinWin Travel is a modern travel platform built with Next.js 14, featuring real-time updates, authentication, and AI-powered features.

## Tech Stack

### Frontend
- **Framework:** Next.js 14.2.35
- **UI Library:** React 18.2
- **Styling:** TailwindCSS + shadcn-ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Data Fetching:** TanStack React Query v5

### Backend
- **Database:** PostgreSQL (via Prisma)
- **ORM:** Prisma 6.19.2
- **Authentication:** NextAuth v4 + Prisma Adapter
- **Real-time:** Socket.IO + Redis Adapter
- **AI:** OpenAI API + ONNX Runtime

### Infrastructure
- **Caching:** Redis (IORedis)
- **Logging:** Pino + Pino Pretty
- **Testing:** Vitest (unit + integration)

## Development

```bash
npm run dev          # Start development server
npm run build        # Build production
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm test:unit        # Run unit tests
npm test:integration # Run integration tests
```

## Project Goals

1. Create modern, performant travel booking platform
2. Real-time updates for bookings and availability
3. AI-powered travel recommendations
4. Secure authentication and authorization
5. Scalable architecture with Redis caching
