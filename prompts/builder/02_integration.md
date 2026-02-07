# Prompt 2: Integration Layer (Unified Adapters)

---

## [MESSAGE 1: IGNITION]

### Task
Implement the `IntegrationAdapter` interface and create mapping logic for provider data.

### Requirements
- **Interface**: Define `IntegrationAdapter` in `src/integrations/integration-adapter.interface.ts`.
- **Contracts**: Define unified `HotelOffer`, `HotelDetails`, and `NormalizedSearchRequest` types.
- **Mock Adapter**: Implement `MockAdapter` to return static data for local development.
-   **Hotelbeds Adapter**: Implement the core of `HotelbedsAdapter` including:
    -   Auth signature generation (SHA256).
    -   Basic `search` method mapping Hotelbeds response to `HotelOffer`.
    -   **Strict Normalization**: Implement a `normalize()` private method to map provider JSON to the internal DTO.
-   **Error Types**: Implement `IntegrationError` classes for timeouts and rate limits.

### Output
A pluggable integration layer where the app can search for hotels via a unified interface.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure no `// mock` comments remain in the adapter mapping logic.
