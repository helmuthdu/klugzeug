---
name: pipeline
description: Run an end-to-end workflow over one scope in ordered stages — plan, build, test, review, docs, deliver — with an approval gate before any code change and one aggregate validation at the end. When one request names several independent tasks, run that workflow once per task. Use when asked for a full pass, an end-to-end workflow, or to take a feature or fix from plan to delivery.
argument-hint: '<scope path> [improve | feature <name> | bug <id> | new-module <name>] [skip: <stage names>] [focus]'
---

# pipeline

Read `references/contract.md` next to this SKILL.md and the profile. Establish the mode first:

- **Assess** (default when the request names no change): `plan`, `review`, and `test` run read-only; `docs` audits only. No code changes, no `build`, no `deliver`. `plan` may write `.plan.md`.
- **Change** (the request names work to implement or fix): all stages run, subject to the approval gate.

## Tasks

A request with one outcome is one task: the stages below run once. When the request names more than one outcome, load `references/tasks.md` and classify before any stage. Plan the independent tasks together for one approval, then build the approved tasks one at a time. Each task has its own scope, mode, plan file, and aggregate validation. A `[BLOCKED]` or missing evidence stops that task only; continue with the next independent task.

## Stages

Each stage follows its own skill (`~/.agents/skills/<stage>/SKILL.md`, or the client's equivalent). Load it before running the stage, and name it in a subagent's brief.

1. **plan**: write or validate `<scope>/.plan.md`. Present the plan and wait.
2. **build**: an approval gate. Runs only after the user approves the plan items, or a named subset. Skipped in assess mode.
3. **test**: gap analysis, starting from the files `build` changed. Writes only the tests still missing inside the approved scope.
4. **review**: the `code` lens, plus `reliability`, `security`, `a11y`, `perf`, `ux`, or `ui` when the scope touches those areas. Present the findings. Fixing them needs approval and a second `build` pass; re-review only the fixed findings. A finding is `— FIXED` only after that pass; otherwise it stays open.
5. **docs**: updates only the pages that the approved change touches, adding what `build` left out.
6. **deliver**: runs only when that task names a delivery action (`commit`, `branch`, PR body, change file, or release notes). Otherwise stop after `docs` and report.

`test` and `docs` do not rewrite what `build` wrote. Changing it takes a finding and a second `build` pass, as for review findings.

Record a stage named after `skip:` as skipped. A skipped `build` gives no later stage authority to change code.

## Subagents

Run a stage as a subagent only when it is bounded and its evidence is independent: for example, `review` of one module while `test` audits another. Each brief states the scope, the question, the evidence to return, the output format, and its write authority (none for review and for test audits; plan may write only the plan file). Treat subagent results as evidence. Verify implementation-sensitive claims before a later stage relies on them.

## Handoff

Pass between stages only: the plan file with its status markers, the approved scope, the files `build` changed, source references, the review verdict and its open findings, baseline failures, and executed checks with their results and inputs. Reuse a passing check only while its inputs are unchanged. Keep the handoff short; do not copy whole files between stages.

## Validation

Each stage runs its focused checks. The aggregate gates from the profile (**Lint**, **Typecheck**, **Test (all)**, **Build**, and **Docs** or **E2E** where set) run once per task, after that task's approved changes are in. Assess-only runs run no aggregate gates unless the user asks for them.

## Stop conditions

Stop that task at any `[BLOCKED]`. Do not continue past a stage of that task whose required evidence is missing. Continue with the next independent task.

## Finish

Report one line per task — scope, status (`done`, `skipped`, or `blocked`), and result — then one stage table for each task that ran, including its aggregate gate commands and their results. List open `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items on the task they belong to.

| Step | Status (done / skipped / blocked) | Result |
| ---- | --------------------------------- | ------ |
