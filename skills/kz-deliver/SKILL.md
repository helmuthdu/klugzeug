---
name: kz-deliver
description: Ship finished work — scoped commits, branches, PR descriptions from the repo template, opening a pull request, change files, and release notes. Performs only the named action. Use when asked to commit, branch, write or open a pull request, add a change file, or draft release notes.
argument-hint: '<action: commit | branch | pr-body | pr | change-file | release-notes> [scope]'
---

# kz-deliver

Read `references/contract.md` next to this SKILL.md and the profile. This skill owns delivery mechanics and does not judge the code.

## Preconditions

- The named action is the only approval. "Commit this" approves a commit, not a push.
- Read `git status` and the complete diff for the scope. Stage and commit only this change's paths (`git add -- <paths>`, `git commit -- <paths>`).
- If a hook fails, report its output and fix the cause or emit `[BLOCKED]`.
- Push the current branch, never with `--force`, only when the request names a push or a pull request. Never rewrite history, delete branches, tag, or publish.
- Before a push or pull request, the profile's aggregate gates must have passed on the final diff; run them if they have not. A red gate is `[BLOCKED]`.
- When a review verdict for the scope is `Needs work` or `Block`, a push or pull request is `[BLOCKED]` until the user accepts the open findings by name; list accepted findings under risks in the pull request body. With no review, say "not reviewed" there. Commits, branches, and change files go ahead either way, with open findings listed in the report.

## Commit

1. Split the work by logical change: one commit per coherent change.
2. Write the subject in the **Commit convention** format, matching the style of recent subjects. Add a body when it helps: why, not what, plus breaking changes and their migration. Use `references/ste-output.md` for commit and PR prose when **Output language** is `ste-artifacts` or `ste-all`.
3. Use the branch the request names, otherwise the current branch. When the current branch is one **Protected branches** names (default `main` and `master`), create a new branch from it first; never commit to a protected branch.
4. Never stage the **Plan file** unless that key says plans are committed.

## Pull request body

1. Start from the repository's PR template: **PR template** names it; otherwise search case-insensitively for `pull_request_template.md` and a `.github/PULL_REQUEST_TEMPLATE/` directory, in the repository and, for a nested package, at the git top level. Keep every heading, comment, and checklist item; fill placeholders accurately and leave unchecked anything you did not verify.
2. Without a template: summary, what changed, validation (commands and results), risks, and breaking changes with migration steps.
3. Write the body to a file or to chat. Open the pull request only when asked, pushing the current branch first.

## Change files and release notes

- Use **Change-file command**, once per changed package when it writes one package per call. Do not scan the working tree for pending change files. Set the change type only where the profile says it matters.
- Build release notes from the change entries and commits in scope. Run **Packed-package check** only when asked. Never publish.

## Report

- **Action performed**: commit hashes, branch name, PR body path or URL, change files created.
- **Validation used**: the gate results the delivery relies on, or "not run".
- **Not done**: pushes, pull request creation, publishing, unless named.
- **Open**: `[BLOCKED]` items, and open review findings the delivery went ahead with.
