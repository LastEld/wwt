# 🔒 Security & Hardening Guide

> Defensive programming and infrastructure security for the WinWin Travel platform.

---

## 1. Application Security

### Data Sanitization
Use `zod` for all incoming API data to prevent injection and malformed payloads.

```typescript
import { z } from 'zod';

const SearchRequestSchema = z.object({
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
  // ... rest of schema
});
```

### Rate Limiting (Upstream Protection)
Protect your budget and integrations with `fastify-rate-limit` or Redis-based limiters.

| Endpoint | Limit | Rationale |
|----------|-------|-----------|
| `/api/search` | 20 req/min | Expensive AI/Integration calls |
| `/api/bookings` | 5 req/min | Anti-fraud / Bot prevention |
| `/api/chat` | 10 req/min | OpenAI API protection |

---

## 2. Infrastructure Hardening

### Content Security Policy (CSP)
Configure specific CSP headers in `next.config.js` to prevent XSS.

```javascript
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.hotelbeds.com https://*.booking.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.openai.com wss://*.winwintravel.com;
`;
```

### CORS Policies
Restrict API access to your frontend domain only.

---

## 3. Sensitive Data Management

- **API Keys**: Use HashiCorp Vault or AWS Secrets Manager for production keys.
- **Personally Identifiable Information (PII)**: Encrypt user emails and names at rest in PostgreSQL using `pgcrypto` or application-level encryption.
- **Payment Info**: Never store raw credit card data. Use Stripe/PCI-compliant tokens only.

---

## 4. Anti-Fraud & Bot Detection

1.  **Honeypot Fields**: Invisible inputs in the booking form to catch bots.
2.  **Turnstile/reCAPTCHA**: Required for the "Reserve" button if unusual patterns are detected.
3.  **Velocity Tracking**: Alert the team if a single IP address attempts 10+ bookings in 1 hour.
