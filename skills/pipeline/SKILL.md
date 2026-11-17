---
name: pipeline
description: Run an end-to-end workflow over one scope in ordered stages — plan, build, test, review, docs, deliver — with each stage as a bounded subagent, an explicit handoff through the plan file, an approval gate before any code change, and one aggregate validation run at the end. Use when asked for a full pass, an end-to-end workflow, or to take a feature or fix from plan to delivery.
argument-hint: '<scope path> [improve | feature <name> | bug <id> | new-module <name>] [skip: <stage names>] [focus]'
---

# pipeline

Read `~/.agents/klugzeug/contract.md` and the profile. Establish the mode first:

- **Assess** (default when the request names no change): `plan`, `review`, and `test` run read-only; `docs` audits only. No code changes, no `build`, no `deliver`. `plan` may write `.plan.md`.
- **Change** (the request names work to implement or fix): all stages run, subject to the approval gate.

## Stages

Each stage follows its own skill (`~/.agents/skills/<stage>/SKILL.md`, or the client's equivalent). Load it before running the stage, and name it in a subagent's brief.

1. **plan**: write or validate `<scope>/.plan.md`. Present the plan and wait.
2. **build**: an approval gate. Runs only after the user approves the plan items, or a named subset. Skipped in assess mode.
3. **test**: gap analysis. Writes tests only inside the approved scope.
4. **review**: the `code` lens, plus `security`, `a11y`, `perf`, `ux`, or `ui` when the scope touches those areas. Present the findings. Fixing them needs approval and a second `build` pass; re-review only the fixed findings. A finding is `— FIXED` only after that pass; otherwise it stays open.
5. **docs**: updates only the pages that the approved change touches.
6. **deliver**: runs only when the request names a delivery action (`commit`, `branch`, PR body, change file, or release notes). Otherwise stop after `docs` and report.

Record a stage named after `skip:` as skipped. A skipped `build` gives no later stage authority to change code.

## Subagents

Run a stage as a subagent only when it is bounded and its evidence is independent: for example, `review` of one module while `test` audits another. Each brief states the scope, the question, the evidence to return, the output format, and its write authority (none for review and for test audits; plan may write only the plan file). Treat subagent results as evidence. Verify implementation-sensitive claims before a later stage relies on them.

## Handoff

Pass between stages only: the plan file with its status markers, the approved scope, source references, unresolved findings, baseline failures, and executed checks with their results and inputs. Reuse a passing check only while its inputs are unchanged. Keep the handoff short; do not copy whole files between stages.

## Validation

Each stage runs its focused checks. The aggregate gates from the profile (lint, typecheck, full tests, build, and docs or e2e where declared) run once, after all approved changes are in. Assess-only runs run no aggregate gates unless the user asks for them.

## Stop conditions

Stop and report at any `[BLOCKED]`. Do not continue past a stage whose required evidence is missing.

## Finish

Report one table, including the aggregate gate commands and their results, then the open `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items.

| Step | Status (done / skipped / blocked) | Result |
| ---- | --------------------------------- | ------ |
