# Prompt 5: AI Personalization (Reactions & Preferences)

---

## [MESSAGE 1: IGNITION]

### Task
Build the `AI Matching Service` foundation and the `Reaction System`.

### Requirements
- **Postgres Storage**: Implement Prisma logic to save/retrieve `Reaction` (Lik/Dislike).
- **User Profiling**: Implement `learnPreferences` to analyze reaction patterns and build a `UserPreferenceProfile`.
- **Preference Storage**: Store learned profiles in Redis for sub-millisecond retrieval.
- **Feature Extraction**: Create an `Amenity Importance Vector` based on which amenities a user frequently likes.
- **Reactions API**: Implement `api/reactions/route.ts`.

### Output
A system that "remembers" what a user likes and builds a technical profile of their hotel preferences.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the "Amenity Importance Vector" logic is fully implemented and not just explained.
