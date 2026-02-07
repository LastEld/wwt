# 💊 The Universal Healing Prompt

> **Purpose**: Use this prompt as the second message after an AI has completed a build step. It forces the AI to audit its own work against the requirements and fill any gaps or "lazy" placeholders.

---

## The Healing Prompt

"I have reviewed your implementation for this step. While you have made significant progress, I need you to perform a **Deep Audit & Healing Cycle**.

Please verify the following and provide a final, complete version of any missing or incomplete logic:

1.  **Requirement Check**: Cross-reference your code against every bullet point in the specific build guide (e.g., `01_foundation.md`). Did you miss any specific Prisma models, env variables, or config options?
2.  **Mock Removal**: Did you use any comments like `// implement logic here` or `// mock data`? If so, replace them with the concrete business logic defined in the `docs/` folder.
3.  **Architectural Alignment**: Ensure you strictly followed the **[Coding Rules Skill](file:///e:/evidenceWWT/skills/coding_rules.md)**. Check for Layer Isolation and DTO usage.
4.  **Consistency**: Check for any naming inconsistencies between your implementation and the **[Internal API Specs](file:///e:/evidenceWWT/docs/internal_api_specs.md)**.
5.  **Final Polish**: Ensure all imports are correct, types are exported, and no 'stub' functions remain.

**Provide the complete, refined code for any file that requires 'healing' to reach 100% completion.**"
