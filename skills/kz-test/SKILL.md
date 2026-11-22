---
name: kz-test
description: Audit, add, fix, or clean up automated tests — coverage gaps per public contract, behaviour-focused unit, component, API, and e2e tests, network-level mocking, and flaky or brittle tests. Use when asked to write, add, improve, fix, or clean up tests, check coverage, or fix flaky tests.
argument-hint: '<scope path> [focus] [audit-only]'
---

# kz-test

Read `references/contract.md` next to this SKILL.md and the profile's **Test (all)**, **Test (one file)**, and **Test layers** keys. Assess by default and report gaps; change tests only when the request asks to add, write, fix, clean up, or improve them. Audit a large scope one module at a time.

## 1. Baseline

Run the focused tests for the area once before editing, but only when you must tell existing failures from regressions. Record the exact command and result.

## 2. Gap analysis

For each public export or user-visible behaviour in scope, check:

- the success path and documented options;
- invalid input and boundary values, when the API accepts them;
- async failure, cancellation, and cleanup, only when the API has those states;
- for interactive UI: keyboard operation, and each state the component renders (loading, empty, error, partial, success, disabled);
- for a handler, query, job, or write: the caller's allowed and refused cases, and the persisted result when it stores one.

Do not invent edge cases the code does not have. Also flag existing tests that are obsolete, duplicated, brittle (asserting structure, class names, or call counts), over-mocked, or asserting several behaviours at once.

## 3. Write tests (when authorised)

- One `describe` per unit. Each `it` names one observable behaviour: "shows a retry button after a failed save", never "works".
- Assert on observable results, not private state. Mock at the boundary **Network helper** names; mock modules only for true externals such as the clock, storage, and browser APIs.
- Make time, randomness, and scheduling deterministic with fake timers or injected clocks. No fixed sleeps.
- An async test that asserts inside a callback must fail when the callback never runs (for example `expect.assertions(n)`).
- Snapshot only stable, human-readable output. Keep tests free of the language's escape hatches (`any`, `as`, unexplained `!` in TypeScript).
- For component and DOM tests, follow `references/frontend-testing.md`.
- Never change a test to hide a real bug. Adjust one only when the behaviour change is intentional, and say so.

## 4. Layers

Put each test in the lowest layer listed in **Test layers** that can observe the behaviour: **unit** for pure functions and modules; **component** for rendering and interaction; **integration** for several modules including the network layer; **e2e** for critical flows only, with the **E2E** command; **visual** only when **Visual baseline** is set.

## 5. Flakiness

Rerun a failing file alone. A test that passes alone and fails in the full run is a flake until shown otherwise: report it `[VERIFY]` with the command. Fix the cause (shared state, timers, ordering) rather than adding retries.

## Validation

Iterate with single-file runs, then run **Test (all)** once after the last change.

## Report

- **Before**: checks run with results, or "not run" with the reason.
- **Scope**: behaviours and contracts checked.
- **Added / Removed / Rewritten**: counts, with each test name and each removal's reason.
- **After**: checks run with results.
- **Remaining gaps**, and `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items.
