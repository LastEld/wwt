# Prompt 6: AI Personalization (Neural Ranking)

---

## [MESSAGE 1: IGNITION]

### Task
Implement the advanced personalization score using a neural approach (Simulated or via ONNX).

### Requirements
- **Scoring Engine**: Implement `calculatePersonalizedScore` combining:
    - Price Sensitivity (PSS).
    - Star/Rating match.
    - Amenity Vector match.
- **Neural Inference**: Integrate `onnxruntime-node` to run the `TwoTowerModel` (as specified in `ai_layer_algorithms.md`) against search results.
- **Pruning**: Implement a 2-stage ranking flow: heuristic top-100 selection followed by neural ranking.
- **Diversity**: Inject diversity logic to avoid "filter bubbles".

### Output
Integrated AI ranking that boosts hotels Alex is likely to love to the top of the search results.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure the "Pruning" logic (Stage 1 vs Stage 2) is correctly implemented for performance.
