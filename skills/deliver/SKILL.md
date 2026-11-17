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

## Commit

1. Split the work by logical change: one commit per coherent change.
2. Write the subject in the profile's convention (for example `type(scope): summary` for conventional commits). Read recent subjects only to match style.
3. Add a body when it helps: why, not what. Note breaking changes and their migration.
4. Use the branch the request names. Otherwise commit on the current branch. Protected branches are the ones the profile names; when it names none, `main` and `master` are protected. Only when the current branch is protected, create a new branch from it. Never commit to a protected branch.
5. Never stage the plan file (`.plan.md`, or the path the profile names) unless the profile says plans are committed.

## Pull request body

1. If the repo has a PR template (the profile names its path, or `.github/pull_request_template.md`), start from it. Keep every heading, comment, and checklist item. Fill placeholders with accurate content, and leave unchecked any item you did not verify.
2. Without a template: summary, what changed, how it was validated (commands and results), risks, and breaking changes with migration steps.
3. Write the body to a file or to chat. Open the pull request only when asked, and push the current branch first.

## Change files and changelog

Use the profile's command. When that command writes one package per call, run it once per changed package. Do not scan the working tree for pending change files. Set the changelog type only where the profile says the type matters.

## Release notes

Build them from the change entries and commits in scope. Do not publish. Run the profile's packed-package check only when it is requested.

## Report

- **Action performed**: commit hashes, branch name, PR body path, change files created.
- **Validation used**: the gate results the delivery relies on.
- **Not done**: pushes, pull request creation, publishing, unless named.
- **Open**: `[BLOCKED]` items.
