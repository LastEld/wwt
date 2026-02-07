# Prompt 10: The Booking Engine (Transactions)

---

## [MESSAGE 1: IGNITION]

### Task
Build the high-reliability booking flow with price locking.

### Requirements
- **State Machine**: Implement the booking logic specified in `booking_logic_deep_dive.md`.
- **Price Lock**: Use Redis to lock prices for 5 minutes during the checkout session.
- **Atomic Transaction**: Implement the Prisma `$transaction` that creates the booking locally and confirms with the provider integration.
- **Safety**: Ensure verification with the provider occurs before any retry if a timeout happens during confirmation.
- **UI**: Build the booking confirmation page and the persistent booking sidebar.

### Output
A robust booking engine that prevents price changes and handles provider failures gracefully.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the "Price Lock" pattern is technically accurate and security-hardened.
