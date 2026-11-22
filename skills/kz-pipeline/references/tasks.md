# Tasks

Load this file only when a pipeline request names more than one outcome. Classify before any stage.

## Order

1. Run `plan` for every independent task, then present all the plans together.
2. The user approves all of them, some of them, or none, unless the request waived the pause as `SKILL.md` describes. A task whose plan is not approved is reported as skipped.
3. Build the approved tasks one at a time, each through its remaining stages and aggregate validation. `build` checks each plan item against the current source first, so a plan made stale by an earlier task is caught there.
4. Plan a dependent task only after the task it depends on finishes, and get its own approval.

## One task

Same scope and the same change set. Several plan items stay one pipeline: one plan file, one approval gate, items in order, one aggregate validation.

Example: a full pass on `packages/spell` that fixes the parser bug and adds the bound helper. Those are items in one `<scope>/.plan.md`.

## Several tasks

Different scopes, or outcomes that do not need each other's code. Each task gets its own scope, mode, plan file, and aggregate validation; approval follows the order above.

Example: "fix login, document the API, and open a PR for the button rename." That is three tasks. A `[BLOCKED]` on the login fix does not stop the API docs or the button pull request.

## Dependent tasks

When a later task needs an earlier task's change, plan and run it after that task. If the earlier task is `[BLOCKED]` or its required evidence is missing, mark the dependent task `[BLOCKED]` and name the task it is waiting on. Continue with tasks that do not depend on it.

## Ambiguous grouping

When the same work could fairly be one plan or several tasks, group by scope (one task per scope), state the grouping when you present the plans, and let the user regroup at approval. Do not ask before planning.

## Delivery

`deliver` runs only for the task that names a delivery action (commit, branch, PR body, pull request, change file, or release notes). One pull request for the whole batch runs only when the request asks for one delivery of the set, and only after the earlier tasks have finished. If an earlier task is blocked, that batch delivery is `[BLOCKED]`.
