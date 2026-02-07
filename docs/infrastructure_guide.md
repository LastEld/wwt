# 🏗️ Infrastructure & DevOps Guide

> Deployment, monitoring, and environment management for WinWin Travel.

---

## 1. Docker Setup

We use a multi-service Docker configuration for development and production.

### Development (`docker-compose.yml`)
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: winwin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/winwin
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
```

### Production Dockerfile (Next.js)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 2. CI/CD (GitHub Actions)

We automate linting, tests, and deployment on every push to `main`.

### Workflow: `ci.yml`
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
```

---

## 3. Monitoring & Logging

### Structured Logging (Pino)
Avoid `console.log`. Use Pino for JSON logs that can be indexed by ELK or Grafana.

```typescript
// src/lib/logger.ts
import pino from 'pino';
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty' // Only in development
  }
});
```

### Error Tracking (Sentry)
Initialize Sentry in `instrument.ts` to catch runtime exceptions in the browser and server.

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
Use **Prometheus** with `@promster/fastify` for backend metrics (request duration, status codes).

---

## 4. Environment Checklist

Before deploying to production, ensure:
- [ ] `NODE_ENV` is set to `production`.
- [ ] Database migrations are run (`prisma migrate deploy`).
- [ ] API keys for Hotelbeds and OpenAI are restricted.
- [ ] SSL certificates are configured (Certbot/Cloudflare).
- [ ] `NEXTAUTH_URL` points to the production domain.
