# STE experiment — vielzeug (`~/Projects/vielzeug`)

Repo profile: root `AGENTS.md` (no **Output language** key; arms use paste vs `shared/ste-output.md` rules). Model: one agent session.

**Validation (package gate):** `bun x vitest run packages/assay/src/__tests__/query.test.ts` — **pass**, 12 tests (2025-11-27).

---

## Task 1 — `/kz-review packages/assay code`

### Control arm

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 3 Low · open: none
Verdict: Ready (no open Critical or High)

[Medium] packages/assay/src/query.ts:67 — queryInShadow and queryAllInShadow read host.shadowRoot only; closed shadow roots expose null, so queries silently miss content that open-mode tests cover. Tests in query.test.ts use open shadows only.
[Medium] packages/assay/src/query.ts:51 — queryByText and getByText compare textContent.trim() to the full string; nested text nodes and substring matches fail without a separate API, which is easy to misuse from Refine tests that see partial text.
[Low] packages/assay/src/query.ts:45 — queryByTestId scans every [data-testid] node under the root on each call; large fixtures pay O(n) per lookup.
[Low] packages/assay/src/events.ts:1 — The confidence-boundary comment is clear; fireSubmit uses SubmitEvent, which jsdom may lack on older setups; test suite exercises events but consumers on odd runtimes are [VERIFY] without their matrix.
[Low] packages/assay/package.json:44 — Runtime dependency on @vielzeug/arsenal for wait helpers; acceptable for the monorepo but unlike the zero-dependency packages in the ecosystem marketing copy.
```

### STE arm (phase 0 paste / ste-reports)

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 3 Low · open: none
Verdict: Ready (no open Critical or High)

[Medium] packages/assay/src/query.ts:67 — queryInShadow uses host.shadowRoot. A closed shadow root is null. Queries return empty results. Tests use open shadows only.
[Medium] packages/assay/src/query.ts:51 — getByText matches trim(textContent) to the full string. Partial text and nested nodes fail. Refine tests can misuse this API.
[Low] packages/assay/src/query.ts:45 — queryByTestId lists every [data-testid] under the root per call. Large trees cost O(n) each time.
[Low] packages/assay/src/events.ts:1 — fireSubmit builds SubmitEvent. jsdom support varies by version. Other runtimes need [VERIFY].
[Low] packages/assay/package.json:44 — The package depends on @vielzeug/arsenal at runtime. Monorepo tests tolerate this. Published copy is not zero-dependency.
```

---

## Task 2 — `/kz-plan packages/assay improve`

### Control — Assessment (excerpt)

Assay is well covered for open shadow, waits, and polyfills. Closed-mode shadow querying is undocumented in tests. Text matching is exact. Arsenal coupling is intentional for abort/sleep.

### STE — Assessment (excerpt)

Assay tests open shadow paths. Closed shadow is untested. Text queries need exact trimmed strings. Arsenal supplies sleep and abort.

### Plan items (both arms; STE does not change item bodies at ste-reports)

```md
### T1 — Test closed shadow roots for queryInShadow

- What: Add a vitest case: attachShadow({ mode: 'closed' }); expect queryInShadow and queryAllInShadow to return null/[].
- Why: Callers may assume shadow queries always work on custom elements.
- Where: `packages/assay/src/__tests__/query.test.ts`
- Effort: S
- Breaking: No
- Done when: `bun x vitest run packages/assay/src/__tests__/query.test.ts` passes.

### T2 — Document exact text matching in README

- What: State that getByText/queryByText use trimmed exact string equality, not substring or regex.
- Why: Matches source in query.ts:51-54 and prevents false expectations.
- Where: `packages/assay/README.md`
- Effort: S
- Breaking: No
- Done when: README section cites the behavior; validate:readme passes for assay.

### P1 — Optional test-id lookup optimization

- What: Cache or scope [data-testid] queries when repeated on the same root.
- Why: query.ts:45-46 scans the full subtree each call.
- Where: `packages/assay/src/query.ts`
- Effort: M
- Breaking: No
- Done when: Benchmark or test shows fewer querySelectorAll calls; existing tests green.
```

---

## Task 3 — `/kz-build` T1

### Control Report

- **Changed:** `packages/assay/src/__tests__/query.test.ts` (closed-shadow case).
- **Validation:** `bun x vitest run packages/assay/src/__tests__/query.test.ts` — see scorecard.
- **Open:** none.

### STE Report

- **Changed:** the same test file.
- **Validation:** the same vitest command.
- **Open:** none.

---

## Phase 1b — profile `ste-reports` (2025-11-27)

**Output language:** `ste-reports` in root `AGENTS.md`. Completed plan **T1** + **T2**.

| Step | Result |
| --- | --- |
| T1 closed-shadow test | `bun x vitest run packages/assay/src/` — 55 passed |
| T2 README + usage text semantics | `validate:readme --package=assay` pass; `validate:docs --package=assay` pass |
| Package lint | `bun run --filter @vielzeug/assay lint` pass |
| `check:ai-data` (AGENTS edit) | pass |

**Report (STE prose, ste-reports tier):** Docs state exact trimmed text matching. Tests cover closed shadow roots. Gates passed. **Open:** none. **Changed:** `packages/assay/src/__tests__/query.test.ts`, `packages/assay/README.md`, `docs/assay/usage.md`, `AGENTS.md`.

## Phase 1 note (historical)

Initial paired runs predated **Output language** on vielzeug; phase 1b runs the build/docs follow-through with profile set.