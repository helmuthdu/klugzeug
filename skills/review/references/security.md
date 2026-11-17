# Security lens

Trace attacker-controlled input from its source (URL, storage, `postMessage`, API response, user input, file import) to a sink (DOM, eval-like execution, URL navigation, query construction, log, or a stored value). Establish reachability and impact before you report a pattern as a vulnerability. A risky pattern with no reachable path is a `CONCERN`.

## Classes to check

**Injection and DOM**
- `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `dangerouslySetInnerHTML` receiving non-constant data.
- `eval`, `new Function`, dynamic `import()` or `<script>` with a user-controlled path or URL.
- URLs in `href`, `src`, `formaction`, or `window.location` with unvalidated schemes (`javascript:`, `data:`) or user-controlled hosts (open redirect).
- Server-side rendering that interpolates request data into HTML or script tags without escaping.

**Prototype pollution**
- Recursive merge, `Object.assign`, or spread applied to untrusted objects.
- Dynamic property writes `obj[key] = value` with user-controlled keys, without guarding `__proto__`, `constructor`, and `prototype`.

**Parsing and matching**
- `JSON.parse` on untrusted input with no shape validation or error handling.
- RegExp built from user input (ReDoS), or catastrophic patterns on untrusted strings.

**Secrets and leakage**
- Secrets, tokens, or PII in the client bundle, in `VITE_`/`NEXT_PUBLIC_`-style variables, in URLs, or in logs.
- Stack traces or internal details returned to the user.
- Tokens in `localStorage` or `sessionStorage` when an httpOnly cookie is available; access to web storage not guarded for `SecurityError`.

**Browser surfaces**
- `postMessage` listeners without an origin check, or with `'*'` target origin for sensitive data.
- Content Security Policy weakened by inline scripts or `unsafe-eval`, when the project controls its CSP.
- State-changing requests without CSRF protection when the backend relies on cookies.
- Client-side permission checks trusted without server verification.

**Types and dependencies**
- `as unknown as T`, unchecked `any`, or `!` hiding a real null path on untrusted data.
- Production code importing a dev-only dependency.
- Known-vulnerable packages, shown by the profile's audit command. Report only with that evidence.

## Output

```text
[VULN Critical|High|Medium|Low] <file>:<line> — <finding>. Risk: <what an attacker could do>. Fix: <remediation>
[CONCERN Critical|High|Medium|Low] <file>:<line> — <finding>. Context: <why it matters, and what is missing to make it exploitable>. Fix: <remediation>
```

End with the posture (two or three sentences), the open-findings count by class and severity, and up to five remediation priorities. Never fix findings from a review request. Report a fix that would break a public export as `[BLOCKED]`.
