# STE experiment paired runs (agent-executed on klugzeug)

Model: same session. Scopes fixed per task. Phase 1 arms follow `shared/ste-output.md` as if **Output language** were `ste-reports`.

---

## Task 1 — `/kz-review skills/kz-deliver code`

### Control arm

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 2 Low · open: none
Verdict: Ready (no open Critical or High)

[Medium] skills/kz-deliver/SKILL.md:22 — Commit body rules omit **Output language**. ste-output assigns commit and PR prose to `ste-artifacts`; only the shared contract gate mentions ste-output.
[Medium] scripts/check-skills.test.mjs:137 — Tests require deliver to name verdicts "Needs work" and "Block". The suite has no test that contract-only citation satisfies the ste-output orphan rule.
[Low] skills/kz-deliver/SKILL.md:29 — Step 1 is one long sentence (~55 words). It is hard to scan; a list of search paths would split the work.
[Low] skills/kz-test/SKILL.md:48 — **Test (all)** gate is required after edits. The repo has no automated test that exercises kz-test skill text.
```

**Validation:** not run (read-only review).

### STE arm (phase 0 paste / ste-reports)

```text
## Summary
Summary: 0 Critical · 0 High · 2 Medium · 2 Low · open: none
Verdict: Ready (no open Critical or High)

[Medium] skills/kz-deliver/SKILL.md:22 — The commit section omits **Output language**. ste-output covers commit text at `ste-artifacts`. The contract gate is the only local cue.
[Medium] scripts/check-skills.test.mjs:137 — The file tests deliver verdict strings. The file has no test for ste-output cited only in contract.
[Low] skills/kz-deliver/SKILL.md:29 — Step 1 exceeds 20 words. Split the template search paths into short lines.
[Low] skills/kz-test/SKILL.md:48 — The skill requires **Test (all)**. The repo does not test this skill file.
```

**Validation:** not run (read-only review).

---

## Task 2 — `/kz-plan skills/kz-test improve`

### Control arm — Assessment (excerpt)

The test skill covers gap analysis and runner discipline. The repository has `scripts/check-skills.test.mjs` and `scripts/kz-issue.test.mjs` but no runner test for `install.sh`. The checker gained `ste-output.md` sync without a regression test for contract-only citation of shared files.

### STE arm — Assessment (excerpt)

The skill defines gap analysis. The repo runs `check-skills.test.mjs` and `kz-issue.test.mjs`. The repo does not test `install.sh`. The checker syncs `ste-output.md`. The checker has no test for contract-only shared citation.

### Plan items (same both arms; STE shortens What/Why only in ste-plan — here ste-reports so items identical)

```md
### T1 — Test contract-cited ste-output orphan rule

- What: Add a check-skills.test.mjs case: ste-output present, cited only in contract.md, must pass.
- Why: Regressions in citedInContract broke packaging on the STE branch.
- Where: `scripts/check-skills.test.mjs` — new subtest
- Effort: S
- Breaking: No
- Done when: `node --test scripts/check-skills.test.mjs` passes and removing the contract cite fails check-skills.

### T2 — Test ste-output missing copy fails with --fix hint

- What: Fixture with contract cite but missing references/ste-output.md; expect fail until --fix.
- Why: Install copies must exist in each skill folder.
- Where: `scripts/check-skills.test.mjs`
- Effort: S
- Breaking: No
- Done when: New test passes on main branch artifacts.

### D1 — Split long PR template search step in kz-deliver

- What: Break step 1 under Pull request body into short search bullets.
- Why: One sentence is hard to follow.
- Where: `skills/kz-deliver/SKILL.md:29`
- Effort: S
- Breaking: No
- Done when: Each instruction is visibly separate; meaning unchanged.
```

(Persisted plan not written to `.plan.md` — experiment-only.)

---

## Task 3 — `/kz-build` item T1 (simulated; no edit)

Simulated execution for **T1** from task 2: would add one subtest; validation would be `node --test scripts/check-skills.test.mjs`.

### Control Report

- **Changed:** none (simulated).
- **Validation:** `node --test scripts/check-skills.test.mjs` — not run (simulated).
- **Open:** none.

### STE Report

- **Changed:** none (simulated).
- **Validation:** `node --test scripts/check-skills.test.mjs` — not run (simulated).
- **Open:** none.

Both arms include **Validation** and **Open**. Gate OK.

---

## Task 1–3 phase 1 (`ste-reports` via ste-output.md)

Outputs match STE arms above (same constraints as phase 0 STE paste). Profile gate did not change findings count or verdict.