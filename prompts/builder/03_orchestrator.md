# Prompt 3: Search Orchestrator (The Brain)

---

## [MESSAGE 1: IGNITION]

### Task
Build the `SearchOrchestrator` service that coordinates multi-provider requests.

### Requirements
- **Service**: Implement `search-orchestrator.ts` in `src/services/search/`.
- **Fan-out**: Use `Promise.allSettled` to query all active adapters in parallel.
- **Deduplication**: Implement identity resolution to merge duplicate hotels from different providers using a compound key: `normalized_name (levenshtein)` + `geogrid (100m)`.
- **Filtering**: Implement `filter-engine.ts` supporting price, stars, amenities, and "reaction-based" filtering.
- **Sorting**: Implement `sort-engine.ts` for price, rating, and relevance.
- **API**: Create the `api/search/route.ts` endpoint.

### Output
An API endpoint that returns a cleaned, deduplicated list of hotels from multiple providers.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Key focus: Identity Resolution must be technically complete, not descriptive.
