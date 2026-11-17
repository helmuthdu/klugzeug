---
name: plan
description: Analyse a codebase, package, or module and write an actionable plan to <scope>/.plan.md — an improvement audit, feature spec, bug triage, or new-module design — including UI states and accessibility and performance criteria for frontend work. Use when asked to plan, audit, spec, design, scope, or triage changes before implementing them.
argument-hint: '<scope path> [improve | feature <name> | bug <id or symptom> | new-module <name>] [focus]'
---

# plan

Read `~/.agents/klugzeug/contract.md` and the project profile. Planning is read-only except for writing `<scope>/.plan.md`. It implements nothing. The scope defaults to the repository root; a focus (file, module, or topic) narrows what is analysed. For a large scope, analyse one module at a time.

## Existing plan

If `<scope>/.plan.md` exists, check each item against the current source before reusing it. Carry forward only the items that still hold. Mark completed or obsolete items rather than dropping them silently. Do not overwrite an in-progress plan without the user's direction.

## Modes

- **improve** (default): audit for architecture, API ergonomics (naming, parameter order, options objects for three or more parameters), unnecessary abstraction, error model and messages, loose types (`any`, broad casts, non-null `!`), duplicated logic, exports without tests, and performance or accessibility gaps visible in the code.
- **feature `<name>`**: spec a capability inside an existing module. Give the problem, target users, three to five use cases, an out-of-scope list, integration points, and one signature per new export with its edge cases and errors.
- **bug `<id or symptom>`**: triage only. Reproduce or locate the code path, state the suspected root cause with evidence, and write a `B` item that names the regression test to add. Do not fix here.
- **new-module `<name>`**: as feature, plus a read of one comparable module so the new one follows the same layout.

## Assessment

Write the Assessment as findings in the contract's finding format, grouped by area (for example, routing, data, UI, tests). Each finding cites `file:line`. A narrative summary may open the section, but it does not replace the findings.

## Frontend additions

In every mode, apply this to any item that touches UI. For `improve`, that means each UI finding that becomes a plan item. State:

- the UI states it covers: loading, empty, error, partial, populated;
- keyboard and focus behaviour for each interactive element;
- at least one measurable acceptance criterion where relevant, such as "the dialog returns focus to its trigger on close" or "adds no dependency to the client bundle beyond the profile's budget".

## Rules

- Mark every change to an existing public export `Breaking: Yes` with migration notes. A breaking change is a `[BLOCKED]` decision until the user confirms it; do not present it as settled.
- Verify every referenced file and symbol exists before writing it into the plan.
- Prefer deleting obsolete patterns to wrapping them.
- Keep the plan as small as the request. One item per independently verifiable change.

## Output: `<scope>/.plan.md`

Use the structure in the contract's Plan file section. Start with `Baseline`: the profile's test, lint, and typecheck status if already known, otherwise `not run`. Each item:

```md
### <ID> — <title>

- What: <concise change>
- Why: <motivation>
- Where: `<file>` — `<symbol>`
- Effort: S | M | L
- Breaking: No | Yes — <what changes and how to migrate>
- Done when: <observable criteria>
```

## Finish

Present the plan in chat with its top items, then ask: implement the plan as written, promote specific Future items, or promote all. Use `AskQuestion` when it is available; otherwise ask the same question in plain text and wait for the answer. Do not implement from this skill.
