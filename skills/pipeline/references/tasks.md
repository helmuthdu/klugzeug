# Tasks

Load this file only when a pipeline request names more than one outcome. Classify before any stage. Run the tasks one at a time.

## One task

Same scope and the same change set. Several plan items stay one pipeline: one plan file, one approval gate, items in order, one aggregate validation.

Example: a full pass on `packages/spell` that fixes the parser bug and adds the bound helper. Those are items in one `<scope>/.plan.md`.

## Several tasks

Different scopes, or outcomes that do not need each other's code. Each task gets its own scope, mode, plan file, approval gate, and aggregate validation.

Example: "fix login, document the API, and open a PR for the button rename." That is three tasks. A `[BLOCKED]` on the login fix does not stop the API docs or the button pull request.

## Dependent tasks

When a later task needs an earlier task's change, run it after that task. If the earlier task is `[BLOCKED]` or its required evidence is missing, mark the dependent task `[BLOCKED]` and name the task it is waiting on. Continue with tasks that do not depend on it.

## Ambiguous grouping

When the same work could fairly be one plan or several tasks, stop with `[BLOCKED]` and ask how to group it. When each task is already a distinct part of the request, do not ask for confirmation of the split.

## Delivery

`deliver` runs only for the task that names a delivery action (`commit`, `branch`, PR body, change file, or release notes). One pull request for the whole batch runs only when the request asks for one delivery of the set, and only after the earlier tasks have finished. If an earlier task is blocked, that batch delivery is `[BLOCKED]`.
