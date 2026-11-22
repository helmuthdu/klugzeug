---
name: kz-review
description: Read-only, source-verified review of code, diffs, PRs, and designs — correctness, APIs, types, UI state, and server handlers — with optional reliability, security, accessibility, performance, UX, and UI lenses. Reports findings; changes nothing. Use when asked to review or check code, a PR, or one of those concerns.
argument-hint: '<scope path or diff> [code | pr | greenfield | reliability | security | a11y | perf | ux | ui] [focus]'
---

# kz-review

Read `references/contract.md` next to this SKILL.md and the profile. A review changes no code. If fixes are requested, hand the approved findings to `kz-build`. Start from the named file, diff, or behaviour. Read the controlling source and its tests before judging it, and expand to dependents only where they can affect a concrete finding.

## Lenses

- **code** (default): correctness, API design, types, tests, UI state when the scope renders UI, handlers when it accepts a request or a write, and data flow.
- **pr**: the complete diff against its stated intent, plus the call sites of every changed public contract, and whether a simpler change would meet the same intent.
- **greenfield**: challenge boundaries and abstractions, and recommend removing those that add no benefit.
- **reliability**, **security**, **a11y**, **perf**, **ux**, **ui**: apply the matching `references/<lens>.md` checklist on top of `code`. Each lens needs its own kind of evidence: reliability needs the write or job traced to its caller-visible result, security needs an input-to-sink path, perf needs a measurement, ux needs a named user task and screen state, ui needs the design reference a finding departs from.

If the request names lenses, load only those. Otherwise use `code`, and add a lens only when that concern is the scope's main risk, such as `security` for an authentication handler. When a lens calls for a rendered observation and the page runs locally, use `references/browser-verification.md`.

## Code checklist

- **Correctness**: off-by-one errors, wrong defaults, incorrect narrowing, swallowed errors, unhandled promise rejections, races between async work and disposal or navigation. Also: navigation and link targets that reach the wrong route, and defaults that hide missing data (`?? {}`, `?? 0`, empty `catch`) where the caller needs to know.
- **Contracts**: naming and parameter order; options objects for three or more parameters; errors surfaced at the boundary that owns them, using the **Error types** key; public return shapes that follow **Return-shape convention**.
- **Types**: unnecessary or unsafe casts and escape hatches the language provides (`as`, `!`, `any` in TypeScript); invariants that the types could express; public types that prevent misuse.
- **UI state**: derived values computed from their inputs, not stored; side effects that only copy state or repeat a fetch; event handlers doing work that belongs in the data layer. Use **Reactivity model**. Initial request parameters must agree with the initial UI controls, and reset must return to the same defaults as the first render. Skip this item when the scope renders no UI.
- **Data fetching**: with a query cache, keys follow **Query key convention** rather than ad-hoc inline literals; dependent queries guarded; no duplicate requests; responses not applied after the owner is gone or a newer request has superseded them. Skip this item when the scope has no query cache.
- **Handlers**: when the scope accepts a request, a job, or a write, the caller is allowed to do it, input is checked before use, and a failure is the error type the caller can handle. Skip this item when the scope has none of those.
- **Text**: user-facing strings through **Translation mechanism**; skip this item when it is `none`.
- **Dependencies and dead code**: unused imports, exports, and packages; module cycles.
- **Tests**: behaviour-focused, aligned with the public API, not over-mocked (see `kz-test`).

Do not report style preferences, anything the formatter handles, or micro-optimisations.

## Process

1. For a PR, read the whole diff first, then full files where a hunk depends on surrounding state, and state whether the change meets its stated intent: met, not met, or `[VERIFY]`.
2. For `greenfield`, list each source reference, export, and dependent before recommending removal. Unknown external usage is `[VERIFY]`.
3. Rank findings by impact relative to the cost of the fix.

## Output

One line per finding, in the contract's format. Security findings use the classes defined in the lens file.

```text
## Summary
Summary: N Critical · N High · N Medium · N Low · open: <list or none>
Verdict: Ready (no open Critical or High) | Needs work (open High) | Block (open Critical)
```

For `greenfield`, report the 4 to 12 highest-value recommendations, each with: Problem, Change, Why better, Impact (references, dependents, unknown usage), Effort (Low/Medium/High), and Done when. End with `## Top Priority Changes`, ranked by value relative to effort. Lens files may add their own closing section.

## Rules

- A fix that would break a public export is `[BLOCKED]`; say so in the finding.
- Do not propose changes outside the reviewed scope unless a finding depends on them.
