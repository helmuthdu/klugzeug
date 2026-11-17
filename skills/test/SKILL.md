---
name: test
description: Audit, add, restructure, or clean up a project's automated tests — coverage gaps per public contract, behaviour-focused unit and component tests, network-level mocking, e2e and visual layers, and removal of flaky or brittle tests. Use when asked to write, add, improve, fix, or clean up tests, or to check test coverage.
argument-hint: '<scope path> [focus] [audit-only]'
---

# test

Read `~/.agents/klugzeug/contract.md` and the profile's test commands and layers. Assess by default: report gaps. Change tests only when the request asks for it (add, write, fix, clean up, improve). A focus narrows the area; a large scope is audited one module at a time.

## 1. Baseline

Run the focused tests for the area once before editing, but only when you must tell existing failures from regressions. Record the exact command and result. Never call a red check green.

## 2. Gap analysis

For each public export or user-visible behaviour in scope, check:

- the success path and documented options;
- invalid input and boundary values, when the API accepts them;
- async failure, cancellation, and cleanup, only when the API has those states;
- for interactive UI: keyboard operation, not only clicks, and the loading, empty, and error states the component renders.

Do not invent timeouts, cancellation, or edge cases the code does not have.

Also flag existing tests that are obsolete, duplicated, brittle (asserting structure, class names, or call counts), over-mocked, or asserting several behaviours at once.

## 3. Write tests (when authorised)

- One `describe` per unit. Each `it` names one observable behaviour: "shows a retry button after a failed save", never "works".
- Query by role, label, and text with the DOM helper the profile declares. Use test ids or selectors only when nothing accessible exists, and say why.
- Interact the way a user does, with the profile's interaction helper. Assert on what is visible, not on private state.
- Mock at the network boundary when the profile declares one. Mock modules only for true externals: clock, storage, browser APIs.
- Make time, randomness, and scheduling deterministic with fake timers or injected clocks. No fixed sleeps.
- Use `expect.assertions(n)` in async tests that assert inside callbacks.
- Snapshot only stable, human-readable output.
- Keep tests strictly typed: no `any`, no unexplained `!` or `as`.
- Never change a test to hide a real bug. Adjust one only when the behaviour change is intentional, and say so.

## 4. Layers

Use the layers the profile declares. Put each test in the lowest layer that can observe the behaviour:

- **unit**: pure functions and modules;
- **component**: rendering and interaction (query order and async patterns in `references/frontend-testing.md`);
- **integration**: several modules, including the network layer;
- **e2e**: real browser, critical flows only;
- **visual**: only when the profile has a visual baseline workflow.

## 5. Flakiness

Rerun the failing file alone to classify it. A test that passes alone and fails in the full run is a flake until shown otherwise: report it `[VERIFY]` with the command used. Fix the cause (shared state, timers, ordering) rather than adding retries.

## Validation

Iterate with single-file runs. After standalone test changes, run the profile's full test command once. Report results against the Before, Added, Removed, and Rewritten counts below.

## Report

- **Before**: checks executed with results, or "not run" with the reason.
- **Scope**: behaviours and contracts checked.
- **Added / Removed / Rewritten**: counts, with each name and each removal's reason.
- **After**: checks executed with results.
- **Remaining gaps** and `[DEFERRED]` items.
