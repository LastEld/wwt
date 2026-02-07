# 🤖 AI Documentation Navigator (MCP Rules)

> This guide provides structured rules for an AI agent to quickly parse, understand, and apply the WinWin Travel documentation landscape.

---

## 🧭 Navigation Protocol

If you are an AI tasked with building or maintaining this platform, follow these **MCP-style Priority Rules**:

### RULE 1: Entry Point Priority
- **Always** start with the root **[README.md](file:///e:/evidenceWWT/README.md)** for a high-level summary.
- **Always** consult the **[Coding Rules Skill](file:///e:/evidenceWWT/skills/coding_rules.md)** before generating any code. These are mandatory constraints.

### RULE 2: Layered Knowledge Retrieval
Refer to specific docs based on the architectural layer you are working on:
- **L1 (Orchestration)**: Read `architecture_hints.md#layer-1` and `internal_api_specs.md`.
- **L2 (Integrations)**: Read `adapter_impl_guide.md`.
- **L3 (AI matching)**: Read `ai_layer_algorithms.md` and `prompts/ranking_context.md`.
- **L4 (Pricing)**: Read `architecture_hints.md#layer-4` and `booking_logic_deep_dive.md`.
- **L5 (User)**: Read `architecture_hints.md#layer-5`.
- **L6 (Real-time)**: Read `realtime_gateway_guide.md`.

### RULE 3: Implementation Sequence
- If you are building the platform from scratch, follow the **[PROMPT_SYSTEM.md](file:///e:/evidenceWWT/PROMPT_SYSTEM.md)** sequentially (Steps 1 through 12).

### RULE 4: Data Schema Resolution
- For Database changes, refer ONLY to the `schema.prisma` block in the **[Master Implementation Plan](file:///e:/evidenceWWT/docs/implementation_plan.md)**.

### RULE 5: Production & Safety Compliance
- Before finishing any task, run the "Verification Checklist" from the relevant guide.
- Refer to **[Security & Hardening](file:///e:/evidenceWWT/docs/security_hardening_guide.md)** for any API or infrastructure changes.

---

## 📁 Repository Quick-Map

| Category | File Pattern | Purpose |
|----------|--------------|---------|
| **Core Architecture** | `docs/architecture_hints.md` | Logic flow and advanced hints. |
| **Integrations**| `docs/adapter_impl_guide.md` | How to add new providers. |
| **Logic Specs** | `docs/*_deep_dive.md` | Specific complex business logic. |
| **AI Governance**| `prompts/` and `skills/` | Tooling and specialized prompts. |
| **Build Flow** | `PROMPT_SYSTEM.md` | The guided roadmap for agents. |

---

## 📌 Context Injection Tip
When initialized, an AI should read:
1. `README.md`
2. `skills/coding_rules.md`
3. `docs/ai_docs_navigator.md` (this file)
to fully align with the project's technical standard.
