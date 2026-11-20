---
name: build
description: Implement, fix, refactor, rename, or migrate code, tests, or tooling — feature work from a plan item, bug fixes that start with a failing regression test, and dependency upgrades — with a change map, propagation to dependents, and per-surface validation. Use when asked to implement, build, fix, refactor, migrate, rename, upgrade dependencies, or work through a .plan.md.
argument-hint: '<scope path> [plan item IDs | bug description | upgrade target]'
---

# build

Read `~/.agents/klugzeug/contract.md` and the project profile (commands, validation gates, conventions). The request sets the scope; stay inside it.

## Preconditions

- Check `git status` first. Preserve changes you did not make; never revert or reformat them.
- Take acceptance criteria from the plan item's `Done when`, the bug report, or the user's words. If none exist, ask.
- Run a pre-change baseline only when the target is known or suspected to be red, or when you need it to attribute a failure. Otherwise validate once, after the change.
- Breaking changes, new dependencies, and irreversible deletions are `[BLOCKED]` gates.
- If a `.plan.md` exists, check its item against the source before acting. A stale item becomes `— OBSOLETE` or goes to the user.

## Flow

1. **Read**: the controlling source, its public surface, its tests, and its call sites. Reuse evidence already gathered in this task.
2. **Change map** (non-trivial work): list the contracts affected, implementation files, exports, tests, docs, dependents, and the validation to run.
3. **Test first for bugs**: write a test that reproduces the reported behaviour and confirm it fails for the reported reason. Then fix.
4. **Edit as one unit**: implementation, exports, types, tests, and the docs that describe the changed behaviour, together. Never leave a half-migrated surface.
5. **Propagate**: search for the same root cause in sibling code with `rg` (add `--hidden` for renames). Fix equivalent occurrences only when they are in scope and verifiable; report the rest as `[DEFERRED]`. Do not propagate on style similarity alone.
6. **Validate**: focused checks while iterating, then the profile's gates for each changed surface, run once and batched. Run **Lint fix** on the files this change touched before the final gate.
7. **Record**: mark the plan item `— DONE`, `— FIXED`, `— OBSOLETE`, or `— NO CHANGE NEEDED`. A review finding this pass fixed is `— FIXED`. For bug fixes, name the regression test.

## Flows by request

- **Feature or refactor**: work the plan items in order, one at a time. Focused checks per item; aggregate gates once, after the last item.
- **Bug fix**: step 3 is mandatory. A fix without a test that failed before and passes after is `[VERIFY]`.
- **Dependency upgrade**: follow `references/dependency-upgrade.md`.
- **Removal, rename, migration, or deprecation**: follow `references/completeness-inventory.md` before editing, and reconcile it after validation.
- **Visible UI change**: after the gates, run `~/.agents/klugzeug/browser-verification.md`.

## Rules

- When a test fails, fix the code, not the test, unless the requested behaviour changes. Say explicitly when it does.
- For an approved breaking change, remove the old path entirely: no shims, dead code, or transitional wrappers. Keep the old path only when the plan item is a deprecation that says to keep it. Report the migration.
- Prefer the simplest design that meets the criteria. No speculative options or extension points.
- Never weaken, skip, or delete a test to get green. Delete a test only when it asserts behaviour that was intentionally removed, and say which.
- Do not commit, push, or publish here. Use `deliver`.

## Validation

Use the profile's validation table for each surface you changed. Typical surfaces: source (tests, typecheck when available, lint, build), public API (surface checks plus docs), tests only (focused tests), config or tooling (its own tests plus a smoke run), and docs (docs validators and build). When TypeScript test files change, also run a typecheck that includes them; if the implementation Typecheck excludes tests, use the separate test-typecheck command. If no check covers them, report that gap as `[VERIFY]`. Do not assume the test runner type-checks. Report the commands you ran and their results.

## Report

- **Changed**: files, grouped by surface.
- **Impact**: public changes, dependents checked, and the propagation outcome.
- **Validation**: commands and results; commands not run, with reasons.
- **Open**: `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items.
