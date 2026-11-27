# Consistency lens

Find drift: more than one way to do the same job in the repository. Use steps 1 to 4 of `../kz-build/references/reuse-check.md` to name the concern, search for it, compare behaviour, and judge the 2:1 split.

## Review rules

- **Diff or `pr` review**: flag only drift the change introduces, meaning a new helper, export, or pattern when an equivalent one exists. Cite the new location and the existing one, from a search you ran.
- **Scope audit**: also list drift that was already there, at most the five highest-impact items.
- **Evidence**: a finding needs the same contract in both places (inputs, return shape, how errors surface). Without proof of that, mark the item `[VERIFY]`. A different contract is a different job, not drift.
- **Severity**, in the contract's finding format:
  - **Medium**: parallel implementations of the same job; list how they differ.
  - **Low**: the same job and behaviour under a different name or location.
  - **High**: only when the divergence changes behaviour callers rely on, for example one path swallows an error the other throws.
- **Tie**: when two patterns have no 2:1 split, give no finding. List `[BLOCKED] choose the canonical <concern>: <A> (<where>) vs <B> (<where>)` in the Summary `open:` list, with the paste-ready AGENTS.md line from the reuse check. It does not change the verdict.
- Do not report formatting, anything the linter handles, or style preference.
- Normalising drift is a change. Hand approved findings to `kz-build`.
