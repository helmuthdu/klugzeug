# klugzeug

A stack-agnostic set of eight agent skills for frontend and backend engineering: `kz-plan`, `kz-build`, `kz-test`, `kz-review`, `kz-docs`, `kz-deliver`, `kz-pipeline`, and `kz-onboard`. The `kz-` prefix keeps them from colliding with built-in client skills such as Cursor's `/review` and `/onboard`. Project specifics live in each repository's `AGENTS.md`, in a `## Project profile` section, not in the skills.

## Skills

| Skill         | Use it for                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `kz-onboard`  | Writing or refreshing a repository's `## Project profile`                                          |
| `kz-plan`     | Audits, feature specs, bug triage, and new-module designs in `<scope>/.plan.md`                    |
| `kz-build`    | Implementing, fixing (test first), refactoring, migrating, and upgrading dependencies              |
| `kz-test`     | Coverage gaps, behaviour-focused tests, flaky-test removal                                         |
| `kz-review`   | Code, PR, and greenfield reviews; `reliability`, `security`, `a11y`, `perf`, `ux`, and `ui` lenses |
| `kz-docs`     | Diátaxis guides, JSDoc, README, verified against source                                            |
| `kz-deliver`  | Commits, branches, PR bodies, pull requests, change files; only the named action                   |
| `kz-pipeline` | One run per independent task: ordered stages, plan approval, and one validation                    |

Ownership: `kz-review` finds problems and never edits; `kz-build` edits; `kz-deliver` only ships. `kz-plan` writes only `.plan.md`; `kz-onboard` writes only the profile section.

[`docs/snippets.md`](docs/snippets.md) has short prompts for everyday work (reviews, fixes, new packages, docs) that invoke these skills.

## Shared files

- `shared/contract.md`: profile resolution, write scope, approval gates, markers, evidence, validation, findings, and the plan file. Every skill reads it on activation, so it stays short.
- `shared/browser-verification.md`: the procedure for checking UI in a real browser. Used by `kz-build` and `kz-review`.

Each skill carries the shared files it cites as regular copies under `references/`, because installers copy skill folders one by one. Edit `shared/`, then run `node scripts/check-skills.mjs --fix` to regenerate the copies.

Skills that use another skill (`kz-pipeline` runs every stage; `kz-plan` reads `kz-review`'s checklist and lenses) find it as a sibling directory, so install all eight into the same folder.

## Install

From a clone, link the skills into your agent folders. This is the install to keep when you are changing klugzeug. `npx skills add -g` may replace these links with a copy of the published branch.

```sh
./install.sh --dry-run                       # show what would be linked
./install.sh                                 # link into ~/.agents/skills
./install.sh --client ~/.claude/skills       # also link each skill into another client folder
./install.sh --uninstall                     # remove links that point into this repository
```

The installer first runs `scripts/check-skills.mjs` and refuses to link a broken set. It never overwrites a path that is not a link into this repository; it reports the collision.

On a machine that does not have the clone, install the published branch. Select all eight skills and the agents you use. Before installing, check for existing skills with the same names in those agents and back up or resolve any collisions: the CLI can overwrite them without asking.

```sh
npx skills add helmuthdu/klugzeug -g
npx skills update -g kz-plan kz-build kz-test kz-review kz-docs kz-deliver kz-pipeline kz-onboard
npx skills remove helmuthdu/klugzeug -g
```

`update` matches installed skill names, not repository names; check that those names belong to klugzeug before updating. `npx skills update -g` with no names refreshes every global skill on the machine, including ones that are not klugzeug. Removal uses the repo recorded as the source in the lock.

Before relying on a client, confirm that it reads the folder you linked. Cursor reads `~/.agents/skills` directly; Claude Code needs `--client ~/.claude/skills`; other clients are `[VERIFY]`. Clients that discover skills only inside the repository, such as Copilot, need a file inside the repo and will not see the global install.

## Project profile

`kz-onboard` writes a `## Project profile` section into `AGENTS.md` from `skills/kz-onboard/references/profile-template.md`, the canonical list of profile keys (commands, test helpers, conventions, validation gates). Each key is a value or `none`. `check-skills` fails when a template key is read by no skill.

Resolution order: the user's request, then the profile (walk up until an `AGENTS.md` contains `## Project profile`), then linked files, then detection from manifests, scripts, and tool configs, then a question to the user. Subtree rules in nearer `AGENTS.md` files bind their directories. A command that is only guessed is marked `[VERIFY]` and never reported as run.

## Design rules

- One canonical shared contract, kept short because every activation pays for it; checked copies for installation.
- Each `SKILL.md` stays within a word budget. Checklists and templates live in `references/`, are cited directly from `SKILL.md`, and load only when used.
- Descriptions say what the skill does and when to use it, without overlapping. Reliability, security, accessibility, performance, UX, and UI are lenses of `kz-review`, not separate skills.
- Approval gates match risk: the request authorises the action it names, and the contract lists the decisions that always stop.
- Skills never widen the scope the request sets, and the contract's smallest-change rule applies to every skill.

## Check

```sh
node scripts/check-skills.mjs          # validate
node scripts/check-skills.mjs --fix    # regenerate shared copies, then validate
node --test scripts/check-skills.test.mjs
```

The checker validates spec frontmatter (name, description with a "Use when" clause, argument-hint, known fields), word budgets for each `SKILL.md` and for `SKILL.md` plus the contract, that every skill tells the agent to read `references/contract.md`, that every cited file and sibling skill exists, that no reference file is orphaned, that shared copies match, that markers and plan statuses use the contract's vocabulary, that every profile key is read by a skill, that the delivery gate names the review verdicts, and that each snippet invokes an existing skill with modes from its `argument-hint`.
