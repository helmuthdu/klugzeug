---
name: kz-plan
description: Analyse code and write an actionable worklist to <scope>/.plan.md — an improvement audit, feature spec, bug triage, or new-module design. Implements nothing. Use when asked to plan, spec, design, scope, or triage work before implementing it, or to audit a module for a list of improvements.
argument-hint: '<scope path> [improve | feature <name> | bug <id or symptom> | new-module <name>] [focus]'
---

# kz-plan

Read `references/contract.md` next to this SKILL.md and the project profile. Planning writes only `<scope>/.plan.md`. The scope defaults to the repository root; a focus (file, module, or topic) narrows it. Analyse a large scope one module at a time.

If a plan already exists, check each item against the current source. Carry forward the items that still hold, mark the rest `— DONE` or `— OBSOLETE` rather than dropping them, and do not replace an in-progress plan without the user's direction.

## Modes

- **improve** (default): audit with the code checklist of the `kz-review` skill installed beside this one (`../kz-review/SKILL.md` from this skill's directory), plus architecture, unnecessary abstraction, duplicated logic, and exports without tests.
- **feature `<name>`**: spec a capability inside an existing module: the problem, target users, three to five use cases, out of scope, integration points, and one signature per new export with its edge cases and errors.
- **bug `<id or symptom>`**: triage only. Reproduce or locate the code path, state the suspected root cause with evidence, and write a `B` item that names the regression test to add.
- **new-module `<name>`**: as feature, after reading one comparable module so the new one follows its layout.

When an item touches security, accessibility, performance, UX, UI, or reliability (persistence, transactions, concurrency, retries, jobs), load only that lens from the `kz-review` skill (`../kz-review/references/<lens>.md`: `security`, `a11y`, `perf`, `ux`, `ui`, `reliability`) and use its criteria. Do not copy the lens into the plan.

## Rules

- Write the Assessment as findings in the contract's format, grouped by area, each citing `file:line`. A short narrative may open it.
- Verify every file and symbol before naming it in the plan.
- One item per independently verifiable change; keep the plan as small as the request. Prefer deleting obsolete patterns to wrapping them.
- Any change to an existing public export is `Breaking: Yes` with migration notes, and stays `[BLOCKED]` until the user confirms it, in the request or at approval.
- **Done when** is observable. For rendered UI, it names the states the change can show and one check a test or browser can observe. For a handler, query, job, or persisted record, it names the success and failure a caller can observe and the test that shows them. Mixed items need both.

## Output: `<scope>/.plan.md`

Sections: Issue (preserve unchanged above Baseline when present), Baseline, Assessment, Proposed API (when relevant), Plan, Future, Risks. Baseline records the **Test (all)**, **Lint**, and **Typecheck** status if already known, otherwise `not run`. Order items bugs first, then by impact per effort:

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

Present the plan with its top items, then ask whether to implement it as written, promote specific Future items, or promote all. Use the client's structured question tool when it has one. Do not implement from this skill.
