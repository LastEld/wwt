# 🏗️ WinWin Travel Builder: Sequential Prompt System

> **Objective**: Build the entire WinWin Travel platform from 0 to production in 12 logical, non-mock steps.

Follow these prompts sequentially to implement the full MVP architecture. Each prompt contains the technical requirements and architecture links needed for that specific build phase.

---

## 📅 Build Sequence

| Step | Focus | Component | File |
|------|-------|-----------|------|
| **1** | **Foundation** | Infrastructure, DB, Auth | [01_foundation.md](file:///e:/evidenceWWT/prompts/builder/01_foundation.md) |
| **2** | **Integration** | Multi-provider Adapters | [02_integration.md](file:///e:/evidenceWWT/prompts/builder/02_integration.md) |
| **3** | **Orchestration** | Search Logic & Deduplication | [03_orchestrator.md](file:///e:/evidenceWWT/prompts/builder/03_orchestrator.md) |
| **4** | **Pricing** | Real-time cache & Validation | [04_pricing_cache.md](file:///e:/evidenceWWT/prompts/builder/04_pricing_cache.md) |
| **5** | **AI Base** | User Reactions & Profiles | [05_ai_base.md](file:///e:/evidenceWWT/prompts/builder/05_ai_base.md) |
| **6** | **AI Ranking** | Neural Personalized Scoring | [06_ai_ranking.md](file:///e:/evidenceWWT/prompts/builder/06_ai_ranking.md) |
| **7** | **Real-time** | WebSockets & Streaming | [07_realtime.md](file:///e:/evidenceWWT/prompts/builder/07_realtime.md) |
| **8** | **Frontend (A)** | Search UI & Design System | [08_frontend_discovery.md](file:///e:/evidenceWWT/prompts/builder/08_frontend_discovery.md) |
| **9** | **Frontend (B)** | Hotel Details & Interactions | [09_frontend_details.md](file:///e:/evidenceWWT/prompts/builder/09_frontend_details.md) |
| **10** | **Transactions** | Booking Flow & Persistence | [10_booking_engine.md](file:///e:/evidenceWWT/prompts/builder/10_booking_engine.md) |
| **11** | **Intelligence** | GPT Chatbot & Tool Bridge | [11_ai_assistant.md](file:///e:/evidenceWWT/prompts/builder/11_ai_assistant.md) |
| **12** | **Production** | Polishing, SEO, and DevOps | [12_production_polish.md](file:///e:/evidenceWWT/prompts/builder/12_production_polish.md) |

---

## 🛡️ Ultimate Hardening Reference

While following the building steps, cross-reference these "Gold Standard" guides:
- **[Security & Hardening](file:///e:/evidenceWWT/docs/security_hardening_guide.md)**: Refine your API safety during Step 3 & 10.
- **[Testing & QA Strategy](file:///e:/evidenceWWT/docs/testing_qa_strategy.md)**: Implement tests during every step.
- **[Scalability & Performance](file:///e:/evidenceWWT/docs/scalability_performance.md)**: Optimize your architecture during Step 4 & 7.
- **[Code Patterns Dictionary](file:///e:/evidenceWWT/docs/code_patterns_dictionary.md)**: Use these standards for all file creation.

---

## 🚦 How to use this system

Each step is designed as a **2-Message Cycle**:

1.  **Message 1 (Ignition)**: Provide the `[MESSAGE 1: IGNITION]` block to your AI assistant to generate the core code.
2.  **Message 2 (Healing)**: After the initial build, Provide the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** (or the specific `[MESSAGE 2: HEALING]` block) to audit and finalize the step.

**Verification**: Always ensure all requirements are "Healed" and complete before moving to the next step. Cross-reference with detailed guides in `docs/` for best practices.
