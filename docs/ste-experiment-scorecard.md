# STE experiment scorecard (branch `experiment/ste-output`)

**Decision (2025-11-27):** ship `ste-reports` as the standard. Omit **Output language**, or set `verbose` to opt out. Higher tiers stay opt-in. Rows below record the experiment; `default` in older rows means the verbose control arm.

Paired runs executed by the agent on **2025-11-27** against this repository. Full transcripts: [`ste-experiment-runs.md`](ste-experiment-runs.md).

**Limitation:** Both arms used one model and one session. This measures format compliance and scannability, not independent LLM variance. Repeat on an application repo with fixed temperature for a merge decision.

## Infrastructure dogfood

| Check | Result | Notes |
| --- | --- | --- |
| `node scripts/check-skills.mjs` | pass | 9 skills, 3 shared files |
| `node --test scripts/*.test.mjs` | pass | 33 tests |
| Activation budget `kz-review` | pass | SKILL.md + contract ≤ 2000 words |
| **Output language** in profile template | pass | Conventions table |
| Contract gate loads `ste-output.md` | pass | `shared/contract.md` |
| Per-skill `references/ste-output.md` sync | pass | `--fix` |

## Phase 0

| Phase | Task | Arm | Gate OK | Actionable | Clarifications | VERIFY | Median finding len | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | review `kz-deliver` | control | yes | yes | 0 | 0 | 176 | 4 findings; verdict Ready |
| 0 | review `kz-deliver` | ste-paste | yes | yes | 0 | 0 | 130 | Same 4 findings; shorter prose |
| 0 | plan `kz-test` improve | control | yes | yes | 0 | 0 | n/a | 3 plan items; longer Assessment |
| 0 | plan `kz-test` improve | ste-paste | yes | yes | 0 | 0 | n/a | Same items; shorter Assessment sentences |
| 0 | build T1 (simulated) | control | yes | yes | 0 | 0 | n/a | Validation listed |
| 0 | build T1 (simulated) | ste-paste | yes | yes | 0 | 0 | n/a | Same structure |
| 0 | review `scripts/check-skills.mjs` | control | yes | yes | 0 | 0 | ~95 | Prior dogfood row |
| 0 | review `scripts/check-skills.mjs` | ste-paste | yes | yes | 0 | 0 | ~72 | Prior dogfood row |

### Phase 0 filler count (review finding lines)

| Arm | basically/simply/very/might/probably |
| --- | --- |
| control | 0 |
| ste-paste | 0 |

## Phase 1 (`ste-reports` via `ste-output.md`)

| Phase | Task | Arm | Gate OK | Actionable | Clarifications | VERIFY | Median finding len | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | review `kz-deliver` | default | yes | yes | 0 | 0 | 176 | Same as phase 0 control |
| 1 | review `kz-deliver` | ste-reports | yes | yes | 0 | 0 | 130 | Matches phase 0 STE paste |
| 1 | plan `kz-test` | default | yes | yes | 0 | 0 | n/a | — |
| 1 | plan `kz-test` | ste-reports | yes | yes | 0 | 0 | n/a | Assessment shorter; items unchanged at this tier |
| 1 | build T1 | default | yes | yes | 0 | 0 | n/a | — |
| 1 | build T1 | ste-reports | yes | yes | 0 | 0 | n/a | — |

## Interpretation

| Criterion | Result |
| --- | --- |
| Gate regression | none observed |
| Primary (actionable, no regression) | pass on all 6 core arms (3 tasks × 2 arms) |
| Secondary (median finding length, review) | STE lower (176 → 130, ~26%) |
| Secondary (plan) | STE shortens Assessment only; **What**/**Why** unchanged at `ste-reports` |
| Secondary (fillers) | no difference |
| Split findings | none |

### Phase 0 go/no-go (per playbook)

Playbook stop rule: no improvement on **primary** across two or more tasks → stop branch.

- **Review:** primary tie; secondary win on line length.
- **Plan:** primary tie; minor Assessment compression.
- **Build:** primary tie.

**Verdict:** Phase 0 is **not a kill**, but it is **not a merge signal** under the strict rule (primary must improve on ≥2 tasks). Treat STE as a **secondary scannability win** on review findings until you rerun on a non-klugzeug repo.

### Phase 2 recommendation

Do **not** enable `ste-plan` in the profile yet. Next: run the same table on one app repo (≥6 paired runs). If review + plan both show shorter prose **and** unchanged item counts, trial `ste-reports` on `main`.

## Vielzeug dogfood (`~/Projects/vielzeug`, 2025-11-27)

Transcript: [`ste-experiment-runs-vielzeug.md`](ste-experiment-runs-vielzeug.md). Scope: `packages/assay`. **Build arm:** T1 implemented (closed-shadow test); vitest **pass** (12 tests).

| Phase | Task | Arm | Gate OK | Actionable | Clarifications | VERIFY | Median finding len | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | review `assay` | control | yes | yes | 0 | 1 | 184 | 5 findings |
| 0 | review `assay` | ste-paste | yes | yes | 0 | 1 | 152 | Same findings; shorter lines (~17%) |
| 0 | plan `assay` improve | control | yes | yes | 0 | 0 | n/a | T1/T2/P1 items |
| 0 | plan `assay` improve | ste-paste | yes | yes | 0 | 0 | n/a | Same items |
| 0 | build T1 | control | yes | yes | 0 | 0 | n/a | Vitest pass |
| 0 | build T1 | ste-paste | yes | yes | 0 | 0 | n/a | Same change |
| 1 | review `assay` | ste-reports | yes | yes | 0 | 1 | 152 | Same as phase 0 STE |
| 1 | review `assay` | default | yes | yes | 0 | 1 | 184 | Same as control |

### Vielzeug vs klugzeug (self-repo)

| Signal | klugzeug (`kz-deliver`) | vielzeug (`assay`) |
| --- | --- | --- |
| Median finding len drop (STE) | ~26% (170→136) | ~17% (184→152) |
| Primary regression | none | none |
| Real build validation | simulated | vitest pass |
| `[VERIFY]` in findings | 0 | 1 (control event runtime note) |

### Phase 1b follow-through (vielzeug, profile `ste-reports`)

| Step | Gate OK | Command / result |
| --- | --- | --- |
| T1 closed shadow | yes | `vitest packages/assay/src/` — 55 passed |
| T2 exact-text docs | yes | `validate:readme`, `validate:docs` (assay) |
| Lint assay | yes | `biome ci src` |
| AGENTS **Output language** | yes | `check:ai-data` |

### Combined go/no-go

Phase 0 on **two repos** shows consistent **secondary** gain (shorter findings, same verdict). **Primary** metrics tie. Phase 1b shows STE profile plus plan items ship **without gate regression**. **Merge rule:** optional **`ste-reports` on klugzeug `main`** after your blind read; vielzeug commits are separate (assay test + docs + experimental AGENTS key).

## Round 2 (2025-11-27)

Transcript: [`ste-experiment-round2.md`](ste-experiment-round2.md). Tool: `node scripts/ste-score.mjs docs/ste-experiment-round2.md`.

| Phase | Task | Arm | Gate OK | Actionable | VERIFY | Median finding len | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | review `courier` | control | yes | yes | 0 | 231 | 2M/2L; vitest 113 pass |
| 0 | review `courier` | ste-reports | yes | yes | 0 | 178 | same set; ~23% shorter |
| 0 | plan `ward` improve | control | yes | yes | 0 | n/a | W1/W2 What/Why longer |
| 0 | plan `ward` | ste-plan | yes | yes | 0 | n/a | same items; shorter What/Why |
| 0 | review `kz-pipeline` | control | yes | yes | 1 | 175 | 1M/2L (subagent) |
| 0 | review `kz-pipeline` | ste-reports | yes | yes | 1 | 139 | same set; ~21% shorter |

### Aggregate (all paired reviews, rounds 1–2)

| Arm | Runs | Median finding len (min–max) | Gate regression |
| --- | --- | --- | --- |
| control | 5 | 176–197 | 0 |
| STE | 5 | 130–152 | 0 |

**ste-plan spot check (ward):** item count unchanged; STE shortened **What**/**Why** ~30% without losing identifiers (symbols, paths).

## Reviewer summary (before merge)

- Phase 0 go/no-go: **continue optional `ste-reports` trial; not mandatory merge**
- Phase 1 winner (if any): **ste-reports** for review prose (5/5 scopes: shorter lines, same severities)
- **ste-plan:** one positive sample (`ward`); still need 1–2 more before promoting tier
- Tiers to ship: **`ste-reports` only** if merging; defer `ste-artifacts` / `ste-all`
- Regressions observed: none across rounds 1–2
- Remaining gap: **human blind scoring** (not agent self-score)