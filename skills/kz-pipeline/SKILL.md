---
name: kz-pipeline
description: Take one or more tasks end to end through plan, build, test, review, docs, and deliver, with plan approval before code changes and one aggregate validation per task. Use when asked for a full pass, an end-to-end workflow, or to take a feature or fix from plan to delivery.
argument-hint: '<scope path> [improve | feature <name> | bug <id> | new-module <name>] [skip: <stage names>] [focus]'
---

# kz-pipeline

Read `references/contract.md` next to this SKILL.md and the profile. Establish the mode first:

- **Assess** (the request names no change): `plan`, `review`, and `test` run read-only and `docs` only audits. No `build`, no `deliver`; `plan` may write `.plan.md`.
- **Change** (the request names work to implement or fix): all stages run, subject to the plan approval below.

## Tasks

A request with one outcome is one task. When it names several outcomes, load `references/tasks.md` and classify them before any stage. Each task has its own scope, mode, plan file, and aggregate validation. A `[BLOCKED]` or missing evidence stops that task only; continue with the next independent one.

## Stages

Stage `<stage>` runs the `kz-<stage>` skill installed beside this one (`../kz-<stage>/SKILL.md` from this skill's directory). Load it before running the stage, and name it in a subagent's brief.

1. **plan**: write or validate `<scope>/.plan.md` and present it. Wait for the user to approve the items, or a named subset, unless the request explicitly says to proceed without stopping. Then challenge the plan yourself first: drop or simplify any item that does not clearly improve correctness, simplicity, or developer experience, and report what you dropped. Items that hit a contract approval gate the request did not approve still wait.
2. **build**: implement the approved items. Skipped in assess mode.
3. **test**: gap analysis starting from the files `build` changed; write only the tests still missing inside the approved scope.
4. **review**: the `code` lens, plus a lens for each concern the change touches (`reliability`, `security`, `a11y`, `perf`, `ux`, `ui`, and `consistency` when the change adds an export or helper). Present the findings. Fixing them needs approval (a request to proceed without stopping approves fixing Critical and High findings) and a second `build` pass, after which only the fixed findings are re-reviewed. A finding is `— FIXED` only after that pass.
5. **docs**: update only the pages the approved change touches, adding what `build` left out.
6. **deliver**: only when the task names a delivery action (commit, branch, PR body, pull request, change file, release notes). Otherwise stop after `docs` and report.

`test` and `docs` do not rewrite what `build` wrote; changing it takes a finding and another `build` pass. A stage named after `skip:` is recorded as skipped, and a skipped `build` gives no later stage authority to change code.

Run a stage as a subagent only when its scope and evidence are independent of the others, such as `review` of one module while `test` audits another.

## Handoff

Pass between stages only: the plan file with its status markers, the approved scope, the files `build` changed, the review verdict and open findings, baseline failures, and executed checks with their results and inputs. Do not copy whole files between stages.

## Validation

Each stage runs its focused checks. The profile's aggregate gates (**Lint**, **Typecheck**, **Test (all)**, **Build**, and **Docs** or **E2E** where set) run once per task, after its approved changes are in. Assess runs no aggregate gates unless asked.

## Finish

Report one line per task (scope, status `done`, `skipped`, or `blocked`, and result), then a stage table for each task that ran, including its aggregate gate commands and results. List open `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items under the task they belong to.

| Stage | Status (done / skipped / blocked) | Result |
| ----- | --------------------------------- | ------ |
