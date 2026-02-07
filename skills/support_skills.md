# 🙋 Support & Information Skills

> Tools for handling policy queries, history, and booking status.

---

## 1. `get_policy_details`

Retrieve cancellation, check-in, and property-specific policy information.

### Schema
```json
{
  "name": "get_policy_details",
  "description": "Answers questions about fees, pets, children, or cancellations.",
  "parameters": {
    "type": "object",
    "properties": {
      "hotelId": { "type": "string" },
      "category": { "type": "string", "enum": ["cancellation", "checkin", "pet_policy", "tax"] }
    },
    "required": ["hotelId"]
  }
}
```

---

## 2. `get_booking_history`

List past and upcoming reservations for the authenticated user.

### Schema
```json
{
  "name": "get_booking_history",
  "description": "Retrieves the user's travel timeline.",
  "parameters": {
    "type": "object",
    "properties": {
      "status": { "type": "string", "enum": ["CONFIRMED", "CANCELLED", "COMPLETED", "ALL"] }
    }
  }
}
```

---

## 3. `track_booking_status`

Get the real-time status of a specific reservation.

### Schema
```json
{
  "name": "track_booking_status",
  "description": "Returns current state of a booking (e.g., 'Awaiting Confirmation').",
  "parameters": {
    "type": "object",
    "properties": {
      "bookingId": { "type": "string" }
    },
    "required": ["bookingId"]
  }
}
```
