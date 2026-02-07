# 🔌 Adapter Implementation Guide

> A step-by-step framework for integrating new hotel providers into the WinWin Travel search engine.

---

## 1. Unified Interface Contract

Every new provider must implement the `IntegrationAdapter` interface. This ensures the `SearchOrchestrator` can communicate with disparate APIs without knowing their internal details.

### Interface Reference
```typescript
interface IntegrationAdapter {
  readonly name: string;
  readonly priority: number;
  
  search(request: NormalizedSearchRequest): Promise<HotelOffer[]>;
  getHotelDetails(hotelId: string): Promise<HotelDetails>;
  checkAvailability(hotelId: string, roomId: string, dates: DateRange): Promise<AvailabilityResult>;
  createBooking(request: BookingRequest): Promise<BookingConfirmation>;
}
```

---

## 2. Implementation Steps

### Step 1: Mapping Data Contracts
Providers have different names for the same things. Create a `mapper.ts` within the adapter directory to handle translation.

| Internal Model | Hotelbeds Example | Booking.com Example |
|----------------|-------------------|----------------------|
| `hotelId`      | `hotelCode`       | `hotel_id`           |
| `pricePerNight`| `netPrice`        | `price_breakdown.all_inclusive_amount` |
| `amenities`    | `facilityList`    | `hotel_facilities`   |

### Step 2: Authentication Handling
Most APIs require a signature or rotating token. Implement a `private generateAuthHeaders()` method.

```typescript
private generateAuthHeaders() {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash('sha256')
    .update(`${this.apiKey}${this.secret}${timestamp}`)
    .digest('hex');
    
  return {
    'Api-key': this.apiKey,
    'X-Signature': signature,
  };
}
```

### Step 3: Rate Limiting & Reliability
- **Concurrency**: Use `p-limit` to restrict the number of simultaneous requests to the provider.
- **Circuit Breaker**: Use `opossum` or similar to "trip" the connection if the provider returns 500s.

```typescript
const limiter = pLimit(10); // Max 10 parallel ops

async search(request) {
  return limiter(() => this.breaker.fire(request));
}
```

---

## 3. Normalization Strategy

The most critical part of an adapter is normalizing the data to our domain model:

1. **Currency**: Always convert the provider's currency to the user's base currency (default: EUR) using our internal conversion service.
2. **Standardized Amenities**: Map provider strings (e.g., "WiFi free", "High-speed internet") to our standard IDs (`amenity_wifi`).
3. **Geo-Coding**: Ensure latitude/longitude are converted to standard GeoJSON format for the map view.

## 4. Advanced Error Resilience

Don't just catch errors—classify and handle them based on their recoverability.

### Error Mapping & Retries
Implement a retry logic with exponential backoff for transient errors (e.g., Network, 503 Service Unavailable).

```typescript
const retryOptions = {
  retries: 3,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 5000,
  onRetry: (err) => logger.warn(`Retrying Hotelbeds due to: ${err.message}`),
};

async function executeWithRetry(fn) {
  return await promiseRetry(async (retry, number) => {
    try {
      return await fn();
    } catch (err) {
      if (isTransientError(err)) {
        return retry(err);
      }
      throw err; // Fail fast for non-recoverable (401, 400)
    }
  }, retryOptions);
}
```

### Sanitizing Provider Data
Providers often return inconsistent types (e.g., `images` as an object vs. an array of strings).

```typescript
function sanitizeImages(images: any): string[] {
  if (Array.isArray(images)) return images.map(img => img.url || img);
  if (typeof images === 'object' && images.url) return [images.url];
  return []; // Fallback image needed
}
```

---

## 5. Verification Checklist

- [ ] Does the adapter handle API errors (4xx, 5xx) gracefully?
- [ ] Are timeouts set (recommended: 5000ms for search)?
- [ ] Is sensitive data (API keys) pulled from `process.env`?
- [ ] Have you added a `MockAdapter` implementation for offline testing?
- [ ] Have you mapped at least the top 10 core amenities?
