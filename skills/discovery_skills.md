# 🔍 Discovery Skills

> Tools for exploring the hotel landscape using search, filters, and maps.

---

## 1. `search_hotels`

Query the multi-provider engine for hotel offers based on user criteria.

### Schema
```json
{
  "name": "search_hotels",
  "description": "Searches for hotels in a specific location with optional filters.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City, landmark, or address" },
      "checkIn": { "type": "string", "format": "date" },
      "checkOut": { "type": "string", "format": "date" },
      "guests": { "type": "integer", "minimum": 1 },
      "filters": {
        "type": "object",
        "properties": {
          "maxPrice": { "type": "number" },
          "minRating": { "type": "number", "minimum": 0, "maximum": 10 },
          "amenities": { "type": "array", "items": { "type": "string" } },
          "propertyType": { "type": "string", "enum": ["hotel", "apartment", "hostel", "boutique"] }
        }
      }
    },
    "required": ["location", "checkIn", "checkOut"]
  }
}
```

---

## 2. `get_nearby_attractions`

Find points of interest near a specific location or hotel.

### Schema
```json
{
  "name": "get_nearby_attractions",
  "description": "Finds landmarks, restaurants, or transport hubs near a coordinate.",
  "parameters": {
    "type": "object",
    "properties": {
      "latitude": { "type": "number" },
      "longitude": { "type": "number" },
      "type": { "type": "string", "enum": ["landmark", "food", "transport", "shopping"] }
    },
    "required": ["latitude", "longitude"]
  }
}
```

---

## 3. `get_trending_destinations`

Get a list of popular locations based on recent global user activity.

### Schema
```json
{
  "name": "get_trending_destinations",
  "description": "Returns current high-demand travel spots.",
  "parameters": {
    "type": "object",
    "properties": {
      "region": { "type": "string", "description": "Optional: e.g., 'Europe', 'Asia'" }
    }
  }
}
```
