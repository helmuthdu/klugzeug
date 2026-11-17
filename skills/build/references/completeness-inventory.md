# Completeness inventory (removals, renames, migrations)

Use this before editing a removal, rename, deprecation, or migration where a missed leftover would break something. Skip it for routine edits.

1. **Name the evidence classes** that can still hold the old name or behaviour. Use those that apply:
   - dependencies and lockfiles (manifests, workspace entries);
   - imports and exports (barrels, re-exports, public types);
   - runtime and configuration names (environment variables, feature flags, routes, CSS classes, i18n keys, query keys);
   - committed generated artifacts and build output;
   - tests, fixtures, snapshots, and mocks;
   - demos, examples, recipes, stories, and docs pages;
   - README, changelog, and migration notes;
   - CI, release scripts, and agent or tooling config (`.github`, `scripts`, `.agents`, editor and AI config).
2. **Track each item** as `active` (still uses the old name), `removed`, `replaced`, `retained` (with a reason), or `unknown` (`[VERIFY]`).
3. **Search every class** with hidden files included: `rg --hidden -n '<old>'`. For a renamed path or prefix, search for the old path string too.
4. **Reconcile after validation**: rerun the searches. Validators only know the new name, so a green run does not prove there are no stale references.
5. **Consumers outside this checkout** (published packages, other repositories) stay `unknown` until checked. Do not conclude "no consumers" from one repository's search.
