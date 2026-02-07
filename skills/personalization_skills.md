# 👤 Personalization Skills

> Tools for managing user feedback, profiles, and tailored recommendations.

---

## 1. `track_reaction`

Record a user's explicit preference for a specific hotel property.

### Schema
```json
{
  "name": "track_reaction",
  "description": "Records a 'Like' or 'Dislike' to tune future AI rankings.",
  "parameters": {
    "type": "object",
    "properties": {
      "hotelId": { "type": "string" },
      "type": { "type": "string", "enum": ["LIKE", "DISLIKE"] }
    },
    "required": ["hotelId", "type"]
  }
}
```

---

## 2. `get_user_profile_summary`

Retrieve a summary of the user's learned preferences and historical patterns.

### Schema
```json
{
  "name": "get_user_profile_summary",
  "description": "Returns learned traits like price sensitivity and preferred styles.",
  "parameters": {
    "type": "object",
    "properties": {
      "userId": { "type": "string" }
    },
    "required": ["userId"]
  }
}
```

---

## 3. `get_personalized_recommendations`

Generate a list of hotels specifically matching the user's learned profile.

### Schema
```json
{
  "name": "get_personalized_recommendations",
  "description": "Returns top-N hotels curated for the unique user identity.",
  "parameters": {
    "type": "object",
    "properties": {
      "limit": { "type": "integer", "default": 5 }
    }
  }
}
```
