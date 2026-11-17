# Dependency upgrade

1. **Inventory**: list outdated and vulnerable packages using the profile's package manager (for example `bun outdated`, `npm outdated`, `pnpm outdated`, `yarn outdated`, and that manager's audit command). If the profile does not name one, detect it from the lockfile (`bun.lock`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`). If neither settles it, mark it `[VERIFY]`. Note the runtime version and the `engines` field.
2. **Classify** each candidate: patch or minor (same major), major, security fix, or toolchain (bundler, test runner, TypeScript, linter). Production and dev-only dependencies carry different risks.
3. **Read release notes** for every major, and for any minor that changes behaviour. Grep the codebase for each API the notes remove or change. Notes you could not read are `[VERIFY]`.
4. **Batch by risk**: patch and minor updates may share one change; each major gets its own change; toolchain updates get their own change. Never mix unrelated majors.
5. **Apply** through the package manager so the lockfile changes with the manifest. Never hand-edit a lockfile. Run codemods that the release notes provide, and review their diff.
6. **Stop for approval** before adding a package that is not already a dependency, or before replacing one with another. Both are new dependencies. Also stop when the new version adds or changes an install script (`preinstall`, `install`, `postinstall`). A script you could not read is `[VERIFY]`.
7. **Validate** with the profile's gates for every affected surface, including e2e when the profile declares it. A red baseline before the upgrade blocks the upgrade.
8. **Report** per change: versions before and after, breaking changes handled, the validation run, and anything `[DEFERRED]`.
