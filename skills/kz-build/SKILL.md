---
name: kz-build
description: Implement, fix, refactor, rename, or migrate code, tests, or tooling, and upgrade dependencies — including .plan.md items, approved review findings, failing builds or test suites, and bug fixes that start with a failing regression test. Use when asked to implement, build, fix, refactor, migrate, rename, upgrade dependencies, or work through a plan.
argument-hint: '<scope path> [plan item IDs | bug description | upgrade target]'
---

# kz-build

Read `references/contract.md` next to this SKILL.md and the project profile. The request sets the scope; stay inside it.

## Before editing

- Take acceptance criteria from the plan item's **Done when**, the bug report, or the user's words. Ask only when none of them says what done looks like.
- Check a plan item against the current source before acting; a stale one becomes `— OBSOLETE` or goes to the user.
- Run a baseline first only when the target is known or suspected to be red, or when you will need it to attribute a failure.

## Flow

1. **Read** the controlling source, its public surface, its tests, and its call sites. Reuse evidence already gathered in this task.
2. **Change map** (non-trivial work): the contracts affected, implementation files, exports, tests, docs, dependents, and the validation to run.
3. **Test first for bugs**: write a test that reproduces the reported behaviour and confirm it fails for the reported reason, then fix. A fix without a test that failed before and passes after is `[VERIFY]`.
4. **Edit as one unit**: implementation, exports, types, tests, and the docs that describe the changed behaviour. Never leave a half-migrated surface. Work plan items in order, one at a time, with focused checks per item.
5. **Propagate**: search sibling code for the same root cause (`rg`, with `--hidden` for renames). Fix equivalent occurrences only when they are in scope and verifiable; report the rest `[DEFERRED]`. Similar style alone is not the same root cause.
6. **Validate**: run **Lint fix** on the touched files, then the profile's gates for each changed surface (source, public API, tests only, config or tooling, docs), once and batched after the last item.
7. **Record**: mark each plan item `— DONE`, `— FIXED` (a bug or review finding), `— OBSOLETE`, or `— NO CHANGE NEEDED`, and name the regression test for bug fixes.

## Special cases

- **Failing build, typecheck, or tests**: run the failing command first and keep its output as the reproduction; with a last known-good ref, diff against it to narrow the cause. Fix related type errors before test failures, since one can cascade into many. Rerun after each fix until the command passes or you reach a `[BLOCKED]`. Never add a suppression (`any`, `@ts-ignore`, `@ts-expect-error`, `.skip`) or loosen config to force green.
- **Dependency upgrade**: follow `references/dependency-upgrade.md`.
- **Removal, rename, migration, or deprecation**: build the inventory in `references/completeness-inventory.md` before editing, and reconcile it after validation.
- **Visible UI change**: after the gates, run `references/browser-verification.md`. Changes with no rendered UI skip it.

## Rules

- When a test fails, fix the code, not the test, unless the requested behaviour changes; say so when it does. Never weaken, skip, or delete a test to get green. Delete one only when its behaviour was intentionally removed, and name it.
- For an approved breaking change, remove the old path entirely: no shims, dead code, or transitional wrappers, unless the item is a deprecation that keeps it. Report the migration.
- Do not commit, push, or publish here; that is `kz-deliver`.

## Report

- **Changed**: files, grouped by surface.
- **Impact**: public changes, dependents checked, and the propagation outcome.
- **Validation**: commands and results; commands not run, with reasons.
- **Open**: `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items.
