# Prompt 4: Pricing, Cache & Availability

---

## [MESSAGE 1: IGNITION]

### Task
Implement the `PricingService` and a Redis-based cache for search results.

### Requirements
- **Caching**: Implement `price-cache.ts` using a "Stale-while-revalidate" pattern for hotel prices.
- **TTL Logic**: Set dynamic TTL based on availability (e.g., shorter TTL for hotels with <3 rooms).
- **Pricing Service**: Implement `calculateTotal` including taxes (VAT, city tax) and service fees.
- **Availability Check**: Implement a direct `checkAvailability` method in the integration layer that bypasses cache when a user selects a room.
- **Currency**: Implement currency conversion logic using daily exchange rates.

### Output
A high-performance pricing system that ensures users see accurate data without overloading provider APIs.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the "Stale-while-revalidate" pattern is fully implemented in the cache logic.
