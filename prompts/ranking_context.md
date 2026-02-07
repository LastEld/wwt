# 🧠 Neural Ranker: Context & Scoring Guidelines

> This document defines the conceptual framework used by the AI Matching Service to weight and rank hotel candidates.

---

## 1. Feature Importance Matrix

| Feature | Weight | Logics |
|---------|--------|--------|
| **User Liked Tag** | +40% | Direct match with explicit user "Likes". |
| **Price Proximity**| +20% | Distance from user's Price Sensitivity Score (PSS). |
| **Location Match** | +15% | Proximity to preferred landmarks or city-center bias. |
| **Star Consistency**| +10% | Alignment with historical star-rating preferences. |
| **Freshness** | +5% | Boost for hotels with recent positive reviews. |
| **Disliked Match** | -80% | Heavy penalty for properties matching "Avoid Patterns". |

---

## 2. Personalization Heuristics

### Boutique Bias
If the user's `UserPreferenceProfile` shows a high frequency of "Likes" on hotels with <50 rooms, apply a 1.2x multiplier to all matching boutique properties.

### Urgency Boost
If the search is for "Check-in today/tomorrow," prioritize hotels with:
- `instant_confirmation: true`
- `automatic_checkin: true`

---

## 3. Embedding Drift
When a user "Dislikes" a hotel, the `Real-time Learning Loop` should move the user's embedding vector exactly `dist * 0.1` away from that hotel's vector in the 384-dimensional space.
