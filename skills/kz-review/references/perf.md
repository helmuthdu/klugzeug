# Performance lens

Measure before you claim. A performance finding needs one of: a measured number (bundle size, timing, Core Web Vitals, render count, retained memory), or a concrete code path that runs on a hot path, with a stated estimate marked `[VERIFY]`. Never report speculative micro-optimisations.

Measure a production build, on the same machine and with the same throttling as the baseline you compare against. Report the median of several runs. A number from a dev server, an unminified bundle, or a single run is `[VERIFY]`.

## What to measure

- **Bundle**: size of the affected entry or chunk, before and after. Use **Analyse command**. Compare with **Bundle budget** when it is set.
- **Loading**: request waterfalls (a request that waits for another that could run in parallel), large unused code loaded on the initial route, missing code splitting for heavy routes or dialogs, and unbounded image sizes or missing dimensions.
- **Updates**: repeated work when the inputs are unchanged, shared values recreated so many dependents update, large lists without the approach named by **Large-list approach** for that size, and expensive computation on a hot path. Map these to **Reactivity model**.
- **Interaction**: synchronous work in an input handler that blocks the main thread long enough to miss the INP target below.
- **Caching**: repeated identical requests, missing cache time or stale time where the data is stable, and fetches that could be deduplicated by the query layer.
- **Memory**: listeners, timers, observers, or subscriptions that are never released, so retained memory grows on each navigation or update. Show the growth across repeated actions.
- **Server**: N+1 queries, a query with no limit on a collection that can grow, and independent awaits that run one after another when they could run together. Name the query or the call, and the input that makes the cost grow.

## Core Web Vitals

The stable Core Web Vitals are Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). First Input Delay was retired in September 2024; do not report it.

The same thresholds apply on mobile and desktop. Good is LCP within 2.5 seconds, INP within 200 milliseconds, and CLS of 0.1 or less. Poor is LCP over 4 seconds, INP over 500 milliseconds, and CLS over 0.25. Judge a page on the 75th percentile of real visits, and report mobile and desktop separately when both exist.

A lab run does not decide pass or fail. Lighthouse, when **Performance measurement command** names it, measures LCP and CLS. A lab load has no user input, so it reports Total Blocking Time where INP would be; treat that as a lab stand-in. Name the tool, the page, the throttling profile, and the run count with every number. When the profile has no field data, mark the field outcome `[VERIFY]`.

Use the browser tooling (`references/browser-verification.md` next to this SKILL.md) when the page renders locally.

## Severity

- **Critical**: the page hangs, crashes, or retained memory grows until the page fails.
- **High**: a core route is in the poor band above, or over **Bundle budget**.
- **Medium**: a measured regression with a bounded effect, or a hot path whose cost is inferred.
- **Low**: a source-backed saving with a small measured effect.

## Reporting

```text
[Critical|High|Medium|Low] <file>:<line> — <problem>. Evidence: <measurement or path, with source> (measured | inferred). Estimate: <expected effect, marked [VERIFY] unless measured>. Fix: <change>
```

Do not present an inferred effect as a measured one.
