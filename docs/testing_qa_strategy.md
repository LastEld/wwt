# 🧪 Testing & QA Strategy

> Comprehensive testing framework for the WinWin Travel ecosystem.

---

## 1. Unit Testing (Vitest / Jest)

Focus on business logic isolation, especially the **Search Orchestrator** and **AI Matching** logic.

### Mocking Providers
Use `msw` (Mock Service Worker) to simulate provider API responses without making network calls.

```typescript
// tests/services/search.test.ts
test('orchestrator deduplicates hotels correctly', async () => {
  const orchestrator = new SearchOrchestrator([mockAdapterA, mockAdapterB]);
  const results = await orchestrator.search(params);
  expect(results).toHaveLength(expectedUniqueCount);
});
```

---

## 2. Integration Testing

Test the interaction between the **Service Layer** and **Database/Redis**.

- **Price Lock Verification**: Test that two simultaneous booking attempts for the last room result in only one success.
- **Profile Merging**: Verify that anonymous reactions correctly migrate to the user account on login.

---

## 3. End-to-End (E2E) Testing (Playwright)

Simulate complete user journeys as defined in the [E2E MVP Case](file:///e:/evidenceWWT/docs/e2e_mvp_case.md).

```typescript
// tests/e2e/booking.spec.ts
test('user can search, like, and initiate booking', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="location"]', 'Paris');
  await page.click('button:has-text("Search")');
  await expect(page.locator('.hotel-card')).toBeVisible();
  
  await page.click('.like-button');
  await page.click('text=Reserve');
  await expect(page.locator('.auth-modal')).toBeVisible();
});
```

---

## 4. AI Verification (LLM Testing)

Since the AI Chatbot and Ranker are non-deterministic, use **Snapshot Testing** for extraction accuracy.

1.  **Prompt Regression**: Test a battery of 50 common user queries against the GPT parser.
2.  **Ranking Validity**: Verify that if a user has 10 "Boutique" likes, boutique hotels actually appear in the top 3 results 95% of the time.

---

## 5. Performance Benchmarking

- **Search Latency**: Target < 2s for aggregated results.
- **Socket Latency**: Target < 50ms for price updates.
- **Memory Profiling**: Monitor the Node.js event loop for blocking during heavy AI ranking tasks.
