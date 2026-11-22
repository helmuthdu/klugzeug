# Prompt snippets

Short prompts for everyday work with the klugzeug skills. Each snippet starts with a `/kz-<skill> <mode>` line; the skill brings the procedure, evidence rules, validation, and report format, so the snippet only adds what the skill cannot know: scope, intent, and preferences that differ from its defaults.

- Fill the `[slots]` and delete optional lines you do not need.
- Commands, stack, test runner, and docs tooling come from the project profile (`/kz-onboard`), so the snippets have no slots for them.
- Snippets chain through the plan file or the conversation: review or plan first, then implement with `/kz-build`, then ship with `/kz-deliver`.

| Snippet | Skill | Replaces |
| ------- | ----- | -------- |
| [Review a change](#review-a-change) | `kz-review pr` | Code review, Independent code review, Changes review |
| [Architecture review](#architecture-review) | `kz-review greenfield` | Architecture review, Design from scratch review, simple Code review |
| [Challenge a proposal](#challenge-a-proposal) | `kz-review greenfield` | Challenge code review |
| [Framework-agnostic API review](#framework-agnostic-api-review) | `kz-review greenfield` | Framework-agnostic API design |
| [Security review](#security-review) | `kz-review security` | Security review |
| [UI and UX review](#ui-and-ux-review) | `kz-review ux ui a11y` | UI/UX review, simple UX/UI review |
| [Consolidation plan](#consolidation-plan) | `kz-plan improve` | Monorepo consolidation analysis |
| [New package](#new-package) | `kz-pipeline new-module` | Create a new package |
| [Full pass](#full-pass) | `kz-pipeline improve` | All at once |
| [Implement](#implement) | `kz-build` | Start implementing, Start implement |
| [Fix failing checks](#fix-failing-checks) | `kz-build` | Fix build, Fix test failures |
| [Restructure tests](#restructure-tests) | `kz-test` | Test restructuring |
| [Update docs](#update-docs) | `kz-docs` | Docs update, Docs only update, simple Update docs |

Reviews never edit. To review and fix in one go, keep the optional "Then fix" line: the review hands the findings you approved there to `kz-build`, which fixes and validates them.

## Review a change

```text
/kz-review pr [uncommitted changes, branch, diff, or paths; default: current branch against its base]
Intent: [PR description, change files, or "infer from the commits"]
Run the focused tests and any build configured for the touched packages; if no build is configured, say so instead of guessing.
Second pass (optional): try to disprove the change, and say whether it is better than what it replaced.
End with: intent met, tests adequate, docs and types accurate, dead or transitional code left, and the verdict.
[Then fix the Critical, High, and Medium findings with kz-build and validate.]
```

## Architecture review

```text
/kz-review greenfield [path]
Constraints: [for example no new dependencies, or none]
Judge it as if designing it from scratch, in this order: developer experience, simplicity, boundaries, maintainability. Breaking changes are acceptable; recommend deleting any layer that does not pay for itself.
Keep to the [5–8] highest value-to-effort recommendations, and list larger long-term changes under Future.
[Then implement the top recommendations with kz-build; breaking changes are approved.]
```

For an implementable worklist instead of a report, use `/kz-plan [path] improve` with the same lines; `/kz-build` can then work through `.plan.md`.

## Challenge a proposal

```text
/kz-review greenfield [.plan.md, or "the proposal above"]
Challenge the proposal before it is implemented: does it clearly improve correctness, simplicity, architecture, maintainability, and developer experience over the current code? Do not accept it because it works or was already proposed.
For each item, say keep, simplify, or reject; for a rejection, give the simpler alternative. End with a verdict on the whole proposal.
```

## Framework-agnostic API review

```text
/kz-review greenfield [path]
Focus: the core's public API as used directly from React 19, Vue 3, and Svelte 5.
Hard constraint: the core stays free of any UI framework, DOM, or scheduler assumption, and there are no adapter packages, now or later.
Find what makes direct use awkward: singletons, hidden globals, lifecycle or event-loop assumptions, and missing subscribe/getSnapshot-style primitives. Keep to the 4–6 highest-impact API changes, each with a before and after signature.
Then show the final API used directly, with no adapter: a React hook on useSyncExternalStore, a Vue composable with ref, computed, and cleanup, and Svelte 5 runes. Name the hooks after the library.
```

## Security review

```text
/kz-review security [path]
Trust boundary: [which input is attacker-controlled, for example "all rendered content comes from users"]
End with a sign-off: clean, or blocked until the listed fixes land.
```

## UI and UX review

```text
/kz-review ux ui a11y [route, component, or URL]
Surface: [marketing page | product UI]; priority devices: [for example mobile-first]
Check it in a browser at the priority widths. Also call out popovers clipped by overflow containers, ad hoc z-index values, labels that overflow at narrow widths, and a generic, templated look.
List what works well and should be kept.
[Then fix the Critical and High findings with kz-build and verify them in the browser.]
```

## Consolidation plan

```text
/kz-plan [packages directory] improve
Focus: duplication and overlap between packages. Catalogue: [path, or "scan the packages"]
Read each package's stated purpose and public exports first. Classify each overlap as exact duplicate, functional overlap, misplaced utility, spread concern, or dependency inversion.
Write plan items only for High and Medium findings, each with the target package, the call sites affected, and the migration; put Low findings in one table. Include the proposed package map and the look-alike utilities that should stay separate. Breaking changes are fine when the benefit is clear.
```

## New package

```text
/kz-pipeline packages/[name] new-module [name]
Package: [@scope/name]. Purpose: [one sentence]
Before planning, confirm no existing package already owns this responsibility; stop if one does. Mirror the closest existing package's layout, build config, package.json shape, and test location.
Depend on workspace packages through the workspace protocol and check the graph for cycles. Keep the public API minimal and documented. Wire the package into the workspace config. [Then open a pull request.]
```

## Full pass

```text
/kz-pipeline [path] improve
Proceed without stopping. Breaking changes are approved: update every dependent and leave no shims or transitional code.
Plan as if designing from scratch, in this order: developer experience, simplicity, boundaries, maintainability. Delete layers that do not pay for themselves.
[Then commit the result.]
```

The pipeline challenges its own plan before building, reviews the resulting diff independently, fixes Critical and High findings, updates the docs, and runs the aggregate gates once. Drop "Proceed without stopping" to approve the plan yourself.

## Implement

```text
/kz-build [path] [plan item IDs, "all of .plan.md including Future", or "the findings above"]
Breaking changes are approved: replace old APIs entirely, update every dependent in the repository, and leave no shims, deprecated exports, or TODOs for later.
When conflicting suggestions exist, pick the simplest one and say why. If a published package's API breaks, note the version bump in the report.
```

## Fix failing checks

```text
/kz-build [path]
Fix the failing [build | typecheck | tests].
Command: [command, or "use the profile"]. Last known-good: [commit or branch, or "unknown"]
[Paste the output, or leave this out and let the agent run the command.]
```

## Restructure tests

```text
/kz-test [path]
Restructure the tests: group them by behaviour, remove obsolete, duplicated, or brittle tests, and fill gaps on the main flows and failure paths. Report coverage before and after.
```

## Update docs

```text
/kz-docs [path]
Bring the docs [and the README] in line with the current implementation: [what changed, or "audit everything"].
[Interactive examples live in <path>; run them.]
End with the removed pages and a 5–10 bullet summary of the changes.
```
