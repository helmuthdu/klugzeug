# Performance lens

Measure before you claim. A performance finding needs one of: a measured number (bundle size, timing, Core Web Vitals, render count), or a concrete code path that runs on a hot path, with a stated estimate marked `[VERIFY]`. Never report speculative micro-optimisations.

## What to measure

- **Bundle**: size of the affected entry or chunk, before and after. Use the profile's analyse or build-report command. Compare with the profile's budget when it has one.
- **Loading**: request waterfalls (a request that waits for another that could run in parallel), large unused code loaded on the initial route, missing code splitting for heavy routes or dialogs, and unbounded image sizes or missing dimensions.
- **Rendering** (framework-specific; map to the project's reactivity model): components re-rendering with unchanged props, context values recreated on every render that fan out to many consumers, lists rendered without virtualization when the profile's data sizes make them large, and expensive computation during render without memoisation.
- **Interaction**: long tasks on input (see INP below) caused by synchronous work in handlers.
- **Caching**: repeated identical requests, missing cache time or stale time where the data is stable, and fetches that could be deduplicated by the query layer.

## Core Web Vitals

Measure with the browser tooling (`~/.agents/klugzeug/browser-verification.md`) or Lighthouse when the profile declares it. Report LCP, INP, and CLS only with the page, the device profile, and the run count. A single run is `[VERIFY]`.

## Reporting

```text
[High|Medium|Low] <file>:<line> — <problem>. Evidence: <measurement or path, with source>. Estimate: <expected effect, marked [VERIFY] unless measured>. Fix: <change>
```

Mark the evidence as `measured` or `inferred`. Do not present an inferred effect as a measured one.
