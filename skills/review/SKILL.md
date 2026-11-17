---
name: review
description: Strict, source-verified review of code, a pull request, or a design — correctness, API design, types, state and data fetching in UI code — with optional security, accessibility (WCAG), or performance lenses. Read-only; approved fixes go to build. Use when asked to review, critique, check code quality, audit for security, check accessibility, assess performance, or assess a PR or design.
argument-hint: '<scope path or diff> [code | pr | greenfield | security | a11y | perf] [focus]'
---

# review

Read `~/.agents/klugzeug/contract.md` and the profile. A review changes no code. If fixes are requested, hand the approved findings to `build`. Start from the named file, diff, or behaviour. Read the controlling source and its tests before judging it, and expand to dependents only where they can affect a concrete finding.

## Lenses

- **code** (default): correctness, API design, types, tests, UI state, and data flow.
- **pr**: the complete diff against its stated intent, plus the call sites of every changed public contract.
- **greenfield**: challenge boundaries and abstractions, and recommend removing those that add no benefit.
- **security**, **a11y**, **perf**: apply the matching `references/<lens>.md` checklist on top of `code`. Each lens needs its own kind of evidence: security needs an input-to-sink path, perf needs a measurement.

If the request names a lens, load only that lens file.

## Code checklist

- **Correctness**: off-by-one errors, wrong defaults, incorrect narrowing, swallowed errors, unhandled promise rejections, races between async work and disposal or navigation. Also: navigation and link targets that reach the wrong route, and defaults that hide missing data (`?? {}`, `?? 0`, empty `catch`) where the caller needs to know.
- **Contracts**: naming and parameter order; options objects for three or more parameters; errors surfaced at the boundary that owns them, using the project's error types; public return shapes that follow the project's convention (from the profile).
- **Types**: unnecessary or unsafe casts and escape hatches the language provides (`as`, `!`, `any` in TypeScript); invariants that the types could express; public types that prevent misuse.
- **UI state**: derived values computed from their inputs, not stored; side effects that only copy state or repeat a fetch; event handlers doing work that belongs in the data layer. Use the profile's reactivity model. Initial request parameters must agree with the initial UI controls, and reset must return to the same defaults as the first render.
- **Data fetching**: with a query cache, keys follow the project's key convention rather than ad-hoc inline literals; dependent queries guarded; no duplicate requests; responses not applied after the owner is gone or a newer request has superseded them.
- **Text**: user-facing strings through the project's translation mechanism, when it has one.
- **Dependencies and dead code**: unused imports, exports, and packages; module cycles.
- **Tests**: behaviour-focused, aligned with the public API, not over-mocked (see `test`).

Do not report style preferences, anything the formatter handles, or micro-optimisations.

## Process

1. For a PR, read the whole diff first, then full files where a hunk depends on surrounding state.
2. Verify every claim in the source. Mark what you cannot verify `[VERIFY]`.
3. For a `pr` review, state whether the change meets its stated intent: met, not met, or `[VERIFY]`.
4. For `greenfield`, list each source reference, export, and dependent before recommending removal. Unknown external usage is `[VERIFY]`.
5. Rank findings by impact relative to the cost of the fix.

## Output

One line per finding, in the contract's format. Security findings use the classes defined in the lens file.

```text
## Summary
Summary: N Critical · N High · N Medium · N Low · open: <list or none>
Verdict: Ready (no open Critical or High) | Needs work (open High) | Block (open Critical)
```

For `greenfield`, report the 4 to 12 highest-value recommendations, each with: Problem, Change, Why better, Impact (references, dependents, unknown usage), Effort (Low/Medium/High), and Done when. End with `## Top Priority Changes`, ranked by value relative to effort.

## Rules

- Never fix a finding by silently breaking a public export. Mark it `[BLOCKED]`.
- Do not propose changes outside the reviewed scope unless a finding depends on them.
- A finding is a claim, not an instruction to edit. Do not start changes from a review request.
