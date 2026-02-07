# 🔌 Internal API Specifications

> Detailed request/response schemas and endpoint behaviors for the WinWin Travel internal service layer.

---

## 1. Search Orchestrator API (`/api/search`)

The primary entry point for the frontend to query the mult-provider engine.

### POST `/api/search`

**Request Body:**
```json
{
  "location": {
    "lat": 48.8566,
    "lon": 2.3522,
    "radius": 5
  },
  "dates": {
    "checkIn": "2026-02-14",
    "checkOut": "2026-02-16"
  },
  "occupancy": {
    "adults": 2,
    "children": []
  },
  "filters": {
    "priceMin": 100,
    "priceMax": 500,
    "amenities": ["wifi", "pool"],
    "minRating": 4.5
  }
}
```

**Response (Success):**
```json
{
  "searchId": "uuid-1234-5678",
  "totalResults": 142,
  "results": [
    {
      "hotelId": "hb-5512",
      "name": "Hotel Brighton",
      "provider": "HOTELBEDS",
      "score": 0.95, // AI Match Score
      "price": {
        "amount": 320,
        "currency": "EUR",
        "total": 640
      },
      "images": ["url1", "url2"],
      "amenities": ["wifi", "pool", "spa"]
    }
  ],
  "facets": {
    "priceRange": { "min": 80, "max": 1200 },
    "amenityCounts": { "pool": 45, "wifi": 142 }
  }
}
```

---

## 2. Reaction System API (`/api/reactions`)

Manages the real-time feedback loop.

### POST `/api/reactions`
**Request:** `{ "hotelId": "hb-5512", "type": "LIKE" }`
**Internal Action**: Updates user profile embedding + stores to Postgres.

---

## 3. Booking Internal Flow (`/api/bookings`)

### POST `/api/bookings/init`
Starts a booking session, locks the price, and validates inventory.

**Response:**
```json
{
  "bookingToken": "jwt-token-valid-for-5m",
  "finalPrice": 640.00,
  "expiry": "2026-01-26T18:10:00Z"
}
```

### POST `/api/bookings/confirm`
Finalizes the transaction with the provider adapter.

**Request:** `{ "bookingToken": "jwt-one", "paymentDetails": { ... } }`
