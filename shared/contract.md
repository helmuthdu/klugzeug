# klugzeug contract

Every klugzeug skill follows these rules. The skill says what to do; this file says how to do it safely. Read it once per task and reuse it across stages.

## Project profile

Project facts (commands, stack, validation gates, conventions) come from the `## Project profile` section of an `AGENTS.md`, resolved in this order:

1. The user's instruction in the current request.
2. The profile: walk up from the target path and use the first `AGENTS.md` that contains a `## Project profile` section. Files without that section are skipped; they do not end the search.
3. Files that the profile links (conventions, references).
4. Detection: `package.json` scripts, lockfile (`bun.lock`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`), tool configs (vitest, jest, playwright, biome, eslint, `tsconfig*.json`).
5. Ask the user, as a `[BLOCKED]` decision.

**Subtree rules.** Every `AGENTS.md` on the walk from the target to the profile file is a rule set for its own subtree. Its rules bind edits inside that subtree, in addition to the profile. A nearer rule wins for its subtree. A rule that conflicts with the profile is a `[BLOCKED]` decision.

**Profile keys.** A skill refers to a project fact by the key name in the list below. Every key is either a value or `none`. A key set to `none` is skipped and listed in the report, never inferred. A key that is absent is `[VERIFY]`.

A command found only by guessing is marked `[VERIFY]` and never reported as run. If no profile exists, say so and suggest `onboard`; do not invent commands.

## Profile keys

Canonical names. `onboard` writes each one into the profile; `check-skills` fails if the template omits one.

- **Install**: install command.
- **Dev command**: command that starts the app for browser checks. When a repository has several apps, list one per target.
- **Browser-test command**: command that runs browser tests against a running app, when the project has one.
- **Test (all)**: full test command.
- **Test (one file)**: command for a single test file.
- **Lint**: lint command.
- **Lint fix**: command that applies fixes.
- **Typecheck**: command that type-checks without emitting.
- **Build**: build command.
- **E2E**: browser end-to-end command.
- **Docs**: docs validators and docs build.
- **Analyse command**: command that reports bundle or chunk sizes.
- **Bundle budget**: size limits per entry or route.
- **Performance measurement command**: lab tool that measures Core Web Vitals (for example Lighthouse).
- **Audit command**: dependency vulnerability audit.
- **Packed-package check**: command that verifies a release artifact before publishing.
- **Change-file command**: command that records a pending release note.
- **Test layers**: which layers exist (unit, component, integration, e2e, visual).
- **Query helper**: DOM query API, role-first.
- **Interaction helper**: user-level interaction API.
- **Network helper**: HTTP-boundary mocking API.
- **Visual baseline**: visual regression workflow.
- **Reactivity model**: how state updates reach the UI.
- **Translation mechanism**: how user-facing strings are translated.
- **Error types**: the project's error classes and where they live.
- **Return-shape convention**: how public functions return results (values, nullable, or result objects).
- **Query key convention**: how data-cache keys are built.
- **Large-list approach**: virtualization or pagination used at a given list size.
- **Design system**: tokens, component library, and design guidelines.
- **Accessibility target**: standard and level, for example WCAG 2.2 AA.
- **Security checklist**: project vulnerability checklist.
- **Doc templates**: templates for docs and README pages.
- **PR template**: pull-request template path.
- **Commit convention**: commit message format.
- **Runtime and package manager**: runtime version and package manager.
- **Plan file**: plan location, whether git ignores it, and whether it is committed.
- **Protected paths**: paths that need explicit approval to change.
- **Protected branches**: branches no skill may commit to.
- **Public API entry points**: files that define public exports.

## Write scope

- The request sets the write scope. "Fix", "implement", "build", "update", "refactor", "migrate" authorise changes inside the named scope. "Review", "audit", "plan", "check", "explain" are read-only, except that `plan` may write `.plan.md`.
- Never widen the scope. Related occurrences are fixed only when they are inside the scope and verifiable; otherwise they are reported as `[DEFERRED]`.
- Do not edit generated files, or lockfiles by hand. Lockfiles change only through the package manager during an approved change.

## Approval gates

Stop and emit `[BLOCKED] <decision>` before:

- a breaking change to a public export, or removing or renaming one;
- adding a runtime dependency (replacing one counts as adding);
- deleting files or data beyond the named scope, or any irreversible operation;
- commit, push, tag, publish, release, or opening a pull request, unless the request names that action (approval does not carry over to the next action);
- proceeding over a red baseline, unless the task is to fix that baseline;
- choosing between materially different designs.

Never use `--no-verify`, skip hooks, or bypass a check to get past a gate.

## Markers

- `[BLOCKED] <decision>`: needs the user before continuing.
- `[VERIFY] <claim>: <reason>`: not confirmed from source or by a run.
- `[DEFERRED] <work>: <reason>`: valid but out of scope for this pass.
- Plan item status is appended to the heading: `— DONE`, `— FIXED`, `— OBSOLETE`, `— NO CHANGE NEEDED`, `— BLOCKED`.

## Findings

One line per finding:

```text
[Critical|High|Medium|Low] <file>:<line> — <problem>. <evidence or impact>. <fix>
```

Security findings prefix the class: `[VULN High]` for a confirmed exploitable issue, `[CONCERN Medium]` for a defence-in-depth gap.

- **Critical**: data loss, an exploitable security flaw, or a broken core path with no workaround.
- **High**: a correctness, public-contract, or security problem users are likely to hit. Blocks merge.
- **Medium**: a real defect or maintainability problem with bounded impact.
- **Low**: a source-backed improvement with limited risk. A style preference alone is never a finding.

## Evidence

- Source code and tests are the truth. Docs, comments, and old plans are claims to check.
- Verify every finding against code you have read. Name the file and line range.
- A stale `.plan.md` is not authorisation. Check its items against the current source before using them.
- Subagents gather bounded evidence. Their reports are evidence, not decisions; verify implementation-sensitive claims before acting on them.

## Validation

- While iterating, run the narrowest check for the changed code (one test file, lint on the file).
- Run aggregate gates (full tests, lint, typecheck, build) once, after the last change, batched.
- Reuse a passing result while its inputs are unchanged. Rerun it after any change to those inputs.
- Separate baseline failures (red before the change) from regressions. Attribute a failure to the change only after reading its assertion.
- Report each command with its result. Commands that could not run go under "not run" with the reason.
- Never claim green from inspection. If a test is flaky, rerun that file alone to classify it; do not hide it.

## Plan file

`<scope>/.plan.md` is the worklist shared by `plan`, `build`, `review`, and `pipeline`. When **Plan file** names another location, use that. A plan file is never committed unless **Plan file** says it is.

- One active plan per scope. Replace a completed or obsolete plan only with the user's direction.
- Item IDs: `B` bug, `D` design, `F` feature, `T` tests, `P` performance, `A` accessibility, `S` security, `X` docs. Order: bugs first, then by impact per effort.
- Each item has: What, Why, Where, Effort (S/M/L), Breaking (No, or Yes with migration), Done when.
- Sections: Baseline, Assessment, Proposed API (when relevant), Plan, Future, Risks.

## Subagents

Give each subagent its scope, the question to answer, the evidence to return, the output format, and its write authority (usually none). Run subagents in parallel only when their scopes do not overlap.

## Report

End every task with the following, unless the skill defines its own report. A skill's report still lists the validation run and the open markers.

- **Changed**: files, grouped by surface.
- **Validation**: each command and its result; commands not run, with the reason.
- **Open**: `[BLOCKED]`, `[VERIFY]`, and `[DEFERRED]` items.
