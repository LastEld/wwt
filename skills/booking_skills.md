# 💰 Booking & Pricing Skills

> Tools for real-time inventory checks, price locks, and transaction initiation.

---

## 1. `validate_availability`

Perform a deep, real-time check for specific room availability.

### Schema
```json
{
  "name": "validate_availability",
  "description": "Checks if a room is still available before showing the booking UI.",
  "parameters": {
    "type": "object",
    "properties": {
      "hotelId": { "type": "string" },
      "roomId": { "type": "string" },
      "dates": {
        "type": "object",
        "properties": {
          "checkIn": { "type": "string", "format": "date" },
          "checkOut": { "type": "string", "format": "date" }
        }
      }
    },
    "required": ["hotelId", "roomId", "dates"]
  }
}
```

---

## 2. `init_price_lock`

Secure a price for 5 minutes to prevent changes during the checkout flow.

### Schema
```json
{
  "name": "init_price_lock",
  "description": "Generates a 5-minute price guarantee token.",
  "parameters": {
    "type": "object",
    "properties": {
      "hotelId": { "type": "string" },
      "roomId": { "type": "string" },
      "totalPrice": { "type": "number" }
    },
    "required": ["hotelId", "roomId", "totalPrice"]
  }
}
```

---

## 3. `process_booking`

Finalize the booking and communicate with the provider integration.

### Schema
```json
{
  "name": "process_booking",
  "description": "Executes the final confirmation of the reservation.",
  "parameters": {
    "type": "object",
    "properties": {
      "lockToken": { "type": "string" },
      "customerInfo": {
        "type": "object",
        "properties": {
          "email": { "type": "string" },
          "phone": { "type": "string" }
        }
      }
    },
    "required": ["lockToken", "customerInfo"]
  }
}
```
