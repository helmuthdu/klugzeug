# ASD-STE100 output experiment

**Status:** Concise output is **standard** on this branch (`ste-reports` when **Output language** is omitted). See [`concise-output.md`](concise-output.md). This file keeps the original experiment protocol for comparison runs.

## Phases

| Phase | Arms | When |
| --- | --- | --- |
| 0 | STE pasted in user message vs none | Before you rely on skills to load `ste-output.md` |
| 1 | `verbose` vs omitted key (`ste-reports`) | After phase 0 is not null |
| 2 | Add `ste-plan` | Only if phase 1 wins on at least two of three core tasks |
| 3 | `ste-artifacts` / `ste-all` | Only if a product need exists |

Core tasks for phases 0 and 1:

1. `/kz-review <module> code`
2. `/kz-plan <scope> improve`
3. `/kz-build` on one `M` plan item

## Setup

- Branch: `experiment/ste-output`; link skills with `./install.sh` from this branch.
- Test repo with `## Project profile` and **Output language** (see below).
- Same model, client, and temperature for each paired run.
- Save transcripts or exports for blind review.

### Profile snippet

```md
### Conventions

| Key | Value |
| --- | --- |
| Output language | `verbose` |
```

Change to `ste-reports`, `ste-plan`, `ste-artifacts`, or `ste-all` per run. See [`shared/ste-output.md`](../shared/ste-output.md) for tier scope.

## Phase 0: user-message STE (no profile)

Run each core task twice on the same scope. Do not change **Output language**. Paste the block below only on the STE arm.

### STE paste block (phase 0)

```text
Output style (ASD-STE100 subset). Apply to your chat and report prose only. Do not change code fences, markers, plan templates, or finding line structure.

- Use sentences of 20 words or fewer. One idea per sentence.
- Use active voice and present tense for procedures.
- Name the noun before the verb (file, command, test).
- Use concrete verbs: read, run, check, fix, report, stop, ask.
- Do not use filler (basically, simply, very) or hedge (might, probably) unless the claim is [VERIFY].
- Keep each finding on one line. Do not split findings into bullets.
```

**Go / no-go (historical):** phase 0 was a kill switch before adoption. The shipped default is `ste-reports`. Use this section only to repeat a comparison.

## Phase 1: profile-driven `ste-reports`

Omit **Output language**, or set `ste-reports`. Pair with `verbose` on the same tasks. The contract loads `references/ste-output.md` unless the value is `verbose`.

Higher tiers: set **Output language** to `ste-plan`, `ste-artifacts`, or `ste-all` only in phase 2+.

## Objectives (per run)

Record these for every arm. Subjective 1–5 scores are optional; use the primary row for decisions.

| Metric | Type | How to measure |
| --- | --- | --- |
| Gate regression | Primary | Wrong or missing **Validation**, spurious `[BLOCKED]`, STE inside code blocks: yes/no |
| Actionable without re-ask | Primary | Human could execute the report without a clarification message: yes/no |
| User clarifications | Secondary | Count of user messages after the first skill report |
| `[VERIFY]` count | Secondary | Count in output (same scope) |
| Finding line length | Secondary | Median characters per finding line; flag split findings |
| Filler sentences | Secondary | Count of basically, simply, might, probably in free prose |

**Merge rule (historical):** the comparison asked for a primary-metric win. Adoption used the secondary scannability result with no gate regression. See [`concise-output.md`](concise-output.md).

## Scorecard template

Copy into [`ste-experiment-scorecard.md`](ste-experiment-scorecard.md) or your PR body.

| Phase | Task | Arm | Gate OK | Actionable | Clarifications | VERIFY | Median finding len | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | review | control | | | | | | |
| 0 | review | ste-paste | | | | | | |
| 0 | plan | control | | | | | | |
| 0 | plan | ste-paste | | | | | | |
| 0 | build | control | | | | | | |
| 0 | build | ste-paste | | | | | | |
| 1 | review | verbose | | | | | | |
| 1 | review | ste-reports | | | | | | |
| 1 | plan | verbose | | | | | | |
| 1 | plan | ste-reports | | | | | | |
| 1 | build | verbose | | | | | | |
| 1 | build | ste-reports | | | | | | |

## Decision

- **Win:** Ship **Output language** and `ste-output.md` to `main`; drop tiers that did not help.
- **Partial:** Ship `ste-reports` only; remove unused tier rows from `ste-output.md`.
- **Loss:** Close the branch; revert profile template and shared files.

## Optional tooling

Run `node scripts/ste-score.mjs docs/ste-experiment-round2.md` for finding-line length and filler counts. See [`ste-experiment-round2.md`](ste-experiment-round2.md).