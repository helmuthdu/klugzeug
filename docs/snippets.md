# Prompt Snippets

Short, reusable prompts for everyday software engineering with [Klugzeug](https://github.com/helmuthdu/klugzeug) and specialized agent skills.

Each snippet defines **what to accomplish**, while the corresponding skill handles **how to accomplish it**: investigation, execution, validation, evidence, and reporting.

The goal is to minimize repeated instructions while maintaining excellent developer experience, code quality, and agent autonomy.

## Conventions

- **Scope:** Replace `[placeholders]` with the relevant context. Omit optional details when the repository already provides them.
- **Ground truth:** Inspect the actual source, configuration, and consumers. Project profiles provide context but should be verified when relevant.
- **Reviews:** Analyze and recommend without modifying files.
- **Implementation:** Apply changes directly, update affected consumers, and validate the result.
- **Breaking changes:** Acceptable when justified by meaningful improvements, never mandatory.
- **Design philosophy:** Favor correctness, simplicity, clear boundaries, maintainability, and excellent DX. Challenge unnecessary abstractions and complexity.
- **Autonomy:** Make reasonable decisions independently. Ask only when essential information is missing or an action requires authorization.
- **Validation:** Run relevant checks and report actual results. Never claim validation that was not performed.
- **Repository safety:** Preserve unrelated changes. Do not commit, push, publish, or create pull requests unless explicitly requested.
- **Reporting:** Be concise, evidence-based, and actionable. Avoid repetitive checklists, generic advice, and unnecessary ceremony.

## 1. Explore & Plan

### Architecture Review

**Skill:** `kz-review greenfield`

Review architecture, API design, and developer experience from a greenfield perspective.

```text
/kz-review greenfield [path]

Focus: architecture, API design, and developer experience.

Evaluate the code as if designing it today. Prioritize DX, simplicity, clear boundaries, and maintainability.

Challenge existing decisions and abstractions. Recommend removing anything that adds more complexity than value, considering actual consumers and migration impact.

Return the [5–8] highest-value improvements, ranked by impact and effort. Separate actionable recommendations from longer-term opportunities.
```

### Challenge Proposal

**Skill:** `kz-review greenfield`

Independently challenge an existing plan or proposed architecture before implementation.

```text
/kz-review greenfield [.plan.md or proposal]

Independently challenge the proposal against its original goal and the current implementation.

For each significant recommendation, decide: Keep, Simplify, Replace, or Reject.

Identify unnecessary abstractions, overlooked alternatives, hidden complexity, regression risks, and changes that provide insufficient value.

Prefer the simplest design that fully solves the problem.

End with a clear verdict and the minimum changes needed before implementation.
```

### Consolidation Plan

**Skill:** `kz-plan improve`

Analyze overlapping responsibilities and duplicated functionality across monorepo packages.

```text
/kz-plan [packages directory] improve

Focus: package responsibilities, overlapping functionality, duplication, and dependency boundaries.

Catalogue: [path or "discover packages"]

Inspect actual public exports, implementations, consumers, and package purposes.

Identify meaningful consolidation opportunities, misplaced utilities, unnecessary package boundaries, and dependency inversions.

Preserve intentional differences and avoid consolidation that introduces awkward coupling.

Produce a prioritized implementation plan with target packages, affected consumers, and migration steps.

Breaking changes are acceptable when the resulting architecture is meaningfully simpler.
```

### Framework-Free API

**Skill:** `kz-review greenfield`

Review framework-agnostic libraries for direct integration with modern UI frameworks.

```text
/kz-review greenfield [path]

Focus: framework-agnostic API design and direct integration with React, Vue, Solid, and Svelte.

Hard constraint: the core must not depend on UI frameworks, DOM APIs, or framework-specific lifecycle and scheduling behavior. No dedicated adapter packages.

Evaluate API ergonomics, state ownership, subscriptions, lifecycle management, type safety, and portability.

Identify actual integration friction before proposing new primitives. Prefer the smallest API that works naturally across the target frameworks.

Recommend [4–6] meaningful improvements with before/after signatures and migration impact.

Demonstrate the proposed API with concise, realistic examples for each target framework.
```

### Triage Bug

**Skill:** `kz-plan bug`

Investigate a bug and establish a grounded plan before implementation.

```text
/kz-plan [path] bug [issue ID or symptom]

Expected: [expected behavior]
Actual: [observed behavior]
Reproduction: [steps, failing test, or unknown]

Investigate the underlying cause, affected behavior, and regression risk.

Prefer the smallest correct fix. Avoid speculative changes or unnecessary refactoring.

Produce an actionable plan with appropriate regression coverage.
```

## 2. Implement & Fix

### Implement

**Skill:** `kz-build`

Implement an approved plan, review findings, or requested improvements.

```text
/kz-build [path] [approved plan items or findings]

Implement the requested changes cohesively.

Challenge recommendations that conflict with the actual code or introduce unnecessary complexity. Prefer the simplest complete solution with excellent DX.

Breaking changes are acceptable when they meaningfully improve the design. Update affected consumers, types, tests, and documentation.

Remove obsolete code rather than maintaining unnecessary compatibility layers.

Follow repository conventions, validate affected packages, and report unresolved issues.
```

### Fix Red Checks

**Skill:** `kz-build`

Diagnose and resolve failing builds, tests, linting, or type checks.

```text
/kz-build [path]

Fix the failing [build | typecheck | tests | lint].

Command: [command or "discover from repository"]
Last known-good: [commit, branch, or unknown]
Failure output: [paste output or let the agent reproduce]

Reproduce the failure, identify its root cause, and apply the simplest correct fix.

Preserve type safety and test integrity. Do not suppress errors, weaken assertions, or skip tests merely to make checks pass.

Rerun affected checks and report the verified outcome.
```

### New Package

**Skill:** `kz-pipeline new-module`

Create and integrate a new monorepo package.

```text
/kz-pipeline packages/[name] new-module [name]

Package: [@scope/name]
Purpose: [one-sentence responsibility]

Confirm no existing package already owns this responsibility. If meaningful overlap exists, explain it before creating a duplicate.

Follow the closest existing package's conventions for structure, tooling, exports, tests, and documentation.

Keep the public API minimal, ergonomic, and type-safe. Avoid unnecessary dependencies and abstractions.

Integrate the package into the workspace, update affected configuration, and verify the dependency graph contains no new cycles.

Validate the package and its integration with the monorepo.
```

### Update Dependencies

**Skill:** `kz-build`

Upgrade dependencies while preserving expected behavior.

```text
/kz-build [path]

Upgrade: [package, dependency group, or all outdated dependencies]
Target: [version, latest compatible, or latest]
Constraints: [optional]

Inspect release notes and relevant breaking changes before upgrading.

Prefer supported, compatible versions. Update configuration, APIs, and affected consumers when required.

Avoid unrelated refactoring and unnecessary dependency additions.

Run relevant build, type-check, lint, and test commands. Report unresolved compatibility issues.
```

## 3. Review & Audit

### Review Diff

**Skill:** `kz-review pr`

Perform an independent code review of recent changes.

```text
/kz-review pr [uncommitted changes, branch, diff, or paths]

Intent: [description or "infer from changes"]

Read the diff, affected files, and relevant consumers.

Evaluate correctness, regressions, architecture, API/DX, tests, performance, and unnecessary complexity.

Challenge whether the changes actually improve the code relative to their intended goal.

Prioritize actionable findings by severity, with concrete fixes and file references. Avoid speculative issues and style-only feedback.

Run relevant validation where available.

Conclude whether the changes should be accepted, revised, or rejected, and why.
```

### Security Review

**Skill:** `kz-review security`

Identify real, reachable security vulnerabilities.

```text
/kz-review security [path]

Trust boundary: [attacker-controlled inputs and relevant entry points]

Trace untrusted data through actual execution paths before assigning severity.

Focus on exploitable vulnerabilities, insecure defaults, authorization boundaries, sensitive data exposure, and dependency risks.

Distinguish verified vulnerabilities from hypothetical hardening opportunities.

Prioritize actionable fixes based on exploitability and impact.

Never reproduce discovered secrets in the report.

End with a clear security assessment and any blocking findings.
```

### Reliability Review

**Skill:** `kz-review reliability`

Evaluate failure handling, consistency, and resilience.

```text
/kz-review reliability [path]

Concern: [failure scenario or "general reliability"]

Evaluate realistic failure modes, data integrity, recovery behavior, concurrency, and error handling.

Trace actual execution paths and distinguish demonstrated risks from hypothetical scenarios.

Prefer straightforward safeguards over unnecessary resilience infrastructure.

Prioritize findings by likelihood, impact, and implementation effort.
```

### UI/UX Review

**Skill:** `kz-review ux ui a11y`

Evaluate usability, visual design, interactions, and accessibility.

```text
/kz-review ux ui a11y [route, component, or URL]

Surface: [marketing page | product UI]
Priority devices: [mobile, desktop, or both]

Evaluate usability, visual hierarchy, consistency, interaction feedback, accessibility, and responsive behavior.

Inspect rendered behavior in a browser when available. Distinguish verified observations from assumptions based on code.

Pay attention to overflow clipping, stacking contexts, keyboard navigation, focus management, narrow layouts, empty/error states, and generic visual patterns.

Prioritize meaningful improvements over cosmetic changes.

Identify successful patterns worth preserving and recommend the three highest-impact improvements.
```

### Motion Design

**Skill:** `motion-design`

Improve motion and interaction quality across a component library or application.

```text
Use the motion-design skill to review and improve motion across [path].

Evaluate consistency, interaction feedback, entrance/exit transitions, interruption handling, performance, and reduced-motion accessibility.

Establish a small, cohesive motion vocabulary using existing design tokens and primitives.

Apply meaningful improvements directly. Prefer purposeful, subtle motion over decorative effects.

Avoid unnecessary dependencies, excessive configuration, and generalized animation abstractions.

Validate rendered behavior, rapid interactions, accessibility, and relevant tests.

Remove animations that introduce friction, visual noise, or unnecessary delays.
```

## 4. Quality & Maintenance

### Restructure Tests

**Skill:** `kz-test`

Improve the organization, clarity, and value of an existing test suite.

```text
/kz-test [path]

Restructure the tests around meaningful behaviors and responsibilities.

Inspect the implementation, test conventions, and existing results before changing anything.

Remove obsolete, duplicated, brittle, or implementation-coupled tests when justified.

Prioritize deterministic tests, clear assertions, minimal mocking, and straightforward setup.

Fill meaningful coverage gaps in critical flows, edge cases, and failure scenarios.

Preserve intended behavior rather than blindly updating expectations to match potentially incorrect code.

Run the relevant suite and compare coverage where available.
```

### Test Gaps

**Skill:** `kz-test audit-only`

Identify missing or low-value test coverage without modifying files.

```text
/kz-test [path] audit-only

Focus: [module, behavior, or "general coverage"]

Evaluate test quality and coverage against the actual implementation.

Identify missing critical scenarios, regression risks, redundant tests, brittle assertions, and excessive mocking.

Prioritize findings by risk and practical value rather than coverage percentage alone.

Recommend concrete tests to add, improve, or remove.

Do not modify files.
```

### Update Docs

**Skill:** `kz-docs`

Bring documentation into alignment with the current implementation.

```text
/kz-docs [path]

Bring the documentation and README into alignment with the current implementation.

Scope: [what changed or "audit all documentation"]

Verify public APIs, types, defaults, behavior, and examples against actual source code.

Follow existing documentation conventions and apply Diátaxis where useful without forcing unnecessary pages.

Update navigation, cross-references, and interactive examples where relevant.

Remove outdated, duplicated, or misleading content.

Keep documentation concise, accurate, and practical. Run available documentation checks.
```

### JSDoc Pass

**Skill:** `kz-docs jsdoc`

Improve source-level API documentation.

```text
/kz-docs [path] jsdoc

Audit public API documentation against the actual implementation.

Correct inaccurate or outdated descriptions, types, parameters, return values, defaults, and examples.

Add missing documentation where it improves API discoverability and developer experience.

Follow the repository's documentation conventions.

Avoid redundant comments that merely restate obvious code.

Do not document obsolete or internal APIs unnecessarily.
```

### Refresh Profile

**Skill:** `kz-onboard`

Audit and maintain project instructions and agent context.

```text
/kz-onboard [repo path]

Audit and improve the repository's AGENTS.md files and project profile.

Verify instructions against current source, tooling, architecture, and documentation.

Preserve intentional project-specific constraints. Correct outdated information, remove redundancy, and resolve conflicting instructions.

Keep root instructions concise and move specialized guidance to scoped files where justified.

Complement the kz-* skills without duplicating their workflows.

Do not modify application code.
```

## 5. End-to-End Workflows

### Full Pass

**Skill:** `kz-pipeline improve`

Perform a comprehensive improvement cycle.

```text
/kz-pipeline [path] improve

Perform a complete improvement pass: analyze, plan, implement, independently review, and validate.

Prioritize correctness, DX, simplicity, clear boundaries, and maintainability.

Breaking changes are permitted when justified, but avoid unnecessary redesign.

Remove obsolete code and update affected consumers without leaving unnecessary compatibility layers.

Challenge the plan before implementation and the resulting diff afterward.

Fix substantive findings and run relevant validation.

Do not commit, push, or publish.
```

### Ship

**Skill:** `kz-deliver commit`

Finalize and deliver completed work.

```text
/kz-deliver commit [and open a pull request]

Branch: [optional branch name]
Base: [optional base branch]
Issue: [optional issue ID]

Verify the final changes and summarize their intent.

Follow repository conventions for commit messages, changelogs, and pull requests.

Commit only the intended changes. Do not include unrelated modifications.

Push or create a pull request only when explicitly requested.
```

## Choosing a Workflow

| Goal                              | Recommended snippet |
| --------------------------------- | ------------------- |
| Improve existing architecture     | Architecture Review |
| Challenge an AI-generated plan    | Challenge Proposal  |
| Reduce package duplication        | Consolidation Plan  |
| Redesign a framework-free library | Framework-Free API  |
| Investigate a bug                 | Triage Bug          |
| Implement approved changes        | Implement           |
| Fix failing checks                | Fix Red Checks      |
| Create a package                  | New Package         |
| Upgrade dependencies              | Update Dependencies |
| Review uncommitted changes        | Review Diff         |
| Audit security                    | Security Review     |
| Investigate failure scenarios     | Reliability Review  |
| Improve interface quality         | UI/UX Review        |
| Improve animations                | Motion Design       |
| Clean up a test suite             | Restructure Tests   |
| Find missing tests                | Test Gaps           |
| Refresh documentation             | Update Docs         |
| Improve API comments              | JSDoc Pass          |
| Maintain AGENTS.md                | Refresh Profile     |
| Execute an improvement cycle      | Full Pass           |
| Commit or open a PR               | Ship                |

## Design Principles

These principles should primarily live in Klugzeug's shared contracts rather than being repeated in every snippet.

**Correctness first.** Understand actual behavior and constraints before making changes.

**Developer experience matters.** Prefer intuitive APIs, discoverable behavior, clear errors, and straightforward maintenance.

**Simplicity over abstraction.** Remove unnecessary layers, configuration, duplication, and indirection.

**Challenge assumptions.** Existing implementations and AI-generated recommendations are both subject to critical review.

**Greenfield-friendly, not rewrite-driven.** Breaking changes are acceptable when justified, but preserving a good design is equally valid.

**Evidence over confidence.** Ground findings in code, actual consumers, execution results, and verified behavior.

**Proportional effort.** Invest in changes that meaningfully improve the outcome. Avoid unnecessary process and exhaustive low-value work.

**Skills own workflows. Snippets own intent.** Keep prompts focused on what makes the current task different.
