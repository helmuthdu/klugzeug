---
name: deliver
description: Prepare finished work for delivery — scoped commits on a branch, a PR description from the repo template, change files or changelog entries. Performs only the named action. Push only when the request names a push or a pull request; never force-push, tag, or publish. Use when asked to commit, branch, write a PR description, open a pull request, write a change file, or prepare release notes.
argument-hint: '<action: commit | branch | pr-body | change-file | release-notes> [scope]'
---

# deliver

Read `~/.agents/klugzeug/contract.md` and the profile. This skill owns delivery mechanics. It does not judge the code. Before delivering, confirm the work was reviewed (or that the user accepts skipping review) and that the required validation ran. If either is missing, emit `[BLOCKED]`.

## Preconditions

- The named action is the only approval. "Commit this" approves a commit, not a push.
- Read `git status` and the complete diff for the scope. Preserve changes you did not make: stage only this change's paths (`git add -- <paths>`), and commit only those paths (`git commit -- <paths>`).
- Never use `--no-verify` or skip hooks. If a hook fails, report its output and fix the cause, or emit `[BLOCKED]`.
- Push the current branch, never with `--force`, only when the request names a push or opening a pull request. Never rewrite history, force-push, delete branches, tag, or publish.
- When a review verdict exists for the scope and it is `Needs work` or `Block`, a push or pull request is `[BLOCKED]` until the user accepts the open findings by name. Commits, branches, and change files go ahead; list the open findings in the report. Put accepted findings in the pull request body under risks.

## Commit

1. Split the work by logical change: one commit per coherent change.
2. Write the subject in the **Commit convention** format (for example `type(scope): summary` for conventional commits). Read recent subjects only to match style.
3. Add a body when it helps: why, not what. Note breaking changes and their migration.
4. Use the branch the request names. Otherwise commit on the current branch. Protected branches are the ones **Protected branches** names; when it is unset, `main` and `master` are protected. Only when the current branch is protected, create a new branch from it. Never commit to a protected branch.
5. Never stage the plan file (the path in **Plan file**) unless **Plan file** says it is committed.

## Pull request body

1. If the repo has a PR template, start from it: **PR template** names its path; otherwise search case-insensitively for `pull_request_template.md` / `PULL_REQUEST_TEMPLATE.md` and a `.github/PULL_REQUEST_TEMPLATE/` directory, in the repository and (for a nested package) at the git top level. Keep every heading, comment, and checklist item. Fill placeholders with accurate content, and leave unchecked any item you did not verify.
2. Without a template: summary, what changed, how it was validated (commands and results), risks, and breaking changes with migration steps.
3. Write the body to a file or to chat. Open the pull request only when asked, and push the current branch first.

## Change files and changelog

Use **Change-file command**. When that command writes one package per call, run it once per changed package. Do not scan the working tree for pending change files. Set the changelog type only where the profile says the type matters.

## Release notes

Build them from the change entries and commits in scope. Do not publish. Run **Packed-package check** only when it is requested.

## Report

- **Action performed**: commit hashes, branch name, PR body path, change files created.
- **Validation used**: the gate results the delivery relies on.
- **Not done**: pushes, pull request creation, publishing, unless named.
- **Open**: `[BLOCKED]` items, and open review findings the delivery went ahead with.
