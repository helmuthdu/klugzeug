# STE experiment round 2 (2025-11-27)

Additional paired scopes. Agent-run; same session limitations as round 1.

| Scope | Task |
| --- | --- |
| `~/Projects/vielzeug/packages/courier` | review code |
| `~/Projects/vielzeug/packages/ward` | plan improve (`ste-plan` What/Why arm) |
| `~/Projects/klugzeug/skills/kz-pipeline` | review code |

---

## A — vielzeug `packages/courier` review

### Control

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 2 Low · open: none
Verdict: Ready

[Medium] packages/courier/src/interceptors.ts:68 — withLogging wraps the user logger in an empty catch. Logger throws disappear. Operators see HTTP success without a log line and cannot diagnose sink failures.
[Medium] packages/courier/src/courier.ts:65 — tap() on a disposed client returns a no-op unsubscribe. request() and prefetch() throw CourierDisposedError. Event subscribers can attach silently after dispose while callers still error.
[Low] packages/courier/src/transport.ts:146 — track() registers AbortControllers but disposalSignal is not composed into buildTimeoutSignal for ordinary requests. dispose() aborts in-flight work via cancelAll; coupling is indirect.
[Low] packages/courier/src/courier.ts:230 — prefetch() omits transport.disposed on the cache load path when cache already holds a pending GET. Minor; get() throws on dispose before cache.
```

### STE (`ste-reports`)

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 2 Low · open: none
Verdict: Ready

[Medium] packages/courier/src/interceptors.ts:68 — withLogging uses an empty catch around the logger. A thrown logger hides failures. The HTTP call still completes.
[Medium] packages/courier/src/courier.ts:65 — tap() on a disposed client returns a noop. request() throws CourierDisposedError. Listeners can subscribe after dispose without an error.
[Low] packages/courier/src/transport.ts:146 — track() lists AbortControllers. disposalSignal is not merged into per-request timeout signals. dispose() still aborts via cancelAll.
[Low] packages/courier/src/courier.ts:230 — prefetch() throws on dispose at entry. Cached pending GET paths are unchanged.
```

**Validation:** `bun x vitest run packages/courier/src/` — 113 passed (round 2).

---

## B — vielzeug `packages/ward` plan (`ste-plan` on What/Why only)

### Control — Assessment

Ward compiles rules once, evaluates in declaration order, default-deny. `_match.ts` and `resource.ts` own pattern semantics; tests cover namespace wildcards. Gaps: no test that documents interaction when both action and resource use `:*`, and observability is tap-only without guidance in AGENTS.

### STE — Assessment

Ward evaluates rules in order. Deny is default. Pattern helpers live in resource.ts. Tests cover wildcards. Document composite namespace cases. State tap usage for audit trails.

### Item W1 — Control What/Why

- **What:** Add tests for paired `action: 'read:*'` and `resource: 'posts:*'` when both match and when one fails.
- **Why:** `matchesPattern` treats each field independently; integrators can misread combined namespace rules.

### Item W1 — STE What/Why

- **What:** Test `read:*` on `posts:*` plus one negative cross-namespace case.
- **Why:** Action and resource patterns match separately. Docs must show combined behavior.

### Item W2 — Control

- **What:** Add a short how-to in `docs/ward/usage.md` for `ward.tap` decision events in tests.
- **Why:** Factory exposes tapper; package AGENTS does not point to observable decision logging.

### Item W2 — STE

- **What:** Document `ward.tap` in usage.md with one expect on allow and deny events.
- **Why:** Tap is the public audit hook. Usage is undocumented.

**Validation:** `bun x vitest run packages/ward/src/` — pass (round 2).

---

## C — klugzeug `skills/kz-pipeline` review

### Control

```text
## Summary
Summary: 0 Critical · 0 High · 1 Medium · 2 Low · open: none
Verdict: Ready

[Medium] skills/kz-pipeline/SKILL.md:22 — plan stage orders self-challenge before user approval except when waived. kz-plan Finish already asks the user. Pipelines can drop items without recording dropped IDs in the stage table.
[Low] skills/kz-pipeline/SKILL.md:31 — subagent guidance is optional without client capability guard. Forks without Task emit [VERIFY] gaps in handoff.
[Low] skills/kz-pipeline/SKILL.md:43 — Finish table omits **Output language** STE prose. Contract gate applies; pipeline reports may ignore ste-output on long stage summaries.
```

### STE

```text
## Summary
Summary: 0 Critical · 0 High · 1 Medium · 2 Low · open: none
Verdict: Ready

[Medium] skills/kz-pipeline/SKILL.md:22 — The plan stage self-challenges before approval. Dropped items may not appear in the Finish table.
[Low] skills/kz-pipeline/SKILL.md:31 — Subagents run when scopes are independent. Clients without Task support leave [VERIFY] handoff gaps.
[Low] skills/kz-pipeline/SKILL.md:43 — Finish prose has no STE reminder. The contract still loads ste-output when the profile requests it.
```

---

## Blind-style readability (agent self-score, labels known)

| Output | Same severity set | Could execute without re-ask | Shorter median line |
| --- | --- | --- | --- |
| courier control → STE | yes (2M/2L) | yes / yes | yes |
| ward plan What/Why | same items | yes / yes | STE ~30% fewer chars in W1–W2 What/Why |
| kz-pipeline control → STE | yes (1M/2L) | yes / yes | yes |