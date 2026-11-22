# Security lens

Trace attacker-controlled input from its source (URL, storage, `postMessage`, API response, user input, file import) to a sink (DOM, eval-like execution, URL navigation, query or command construction, a filesystem path, an outbound request, a log, or a stored value). Establish reachability and impact before you report a pattern as a vulnerability. A risky pattern with no reachable path is a `CONCERN`.

If **Security checklist** is set, apply it as well; it wins where the two differ.

Confirm a finding by reading the source. Never send an exploit payload, a scanner, or a proof of concept to a deployed environment. A runtime check runs only against a local server started through **Dev command**.

Cite a CWE identifier in the finding when one fits.

## Classes to check

**Injection and DOM**
- Raw HTML sinks (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, and any framework helper that writes unsanitized HTML) receiving non-constant data.
- `eval`, `new Function`, dynamic `import()` or `<script>` with a user-controlled path or URL.
- URLs in `href`, `src`, `formaction`, or `window.location` with unvalidated schemes (`javascript:`, `data:`) or user-controlled hosts (open redirect).
- Server-side rendering that interpolates request data into HTML or script tags without escaping.

**Server and API**
- Request data concatenated or interpolated into a SQL query, a NoSQL query, or a shell command. Bound parameters are the expected form.
- A user-controlled path joined onto a directory without normalising it and checking that the result stays inside that directory.
- The server requests a URL taken from the request, with no allow-list of schemes and hosts. A redirect to a host outside that list counts.
- A handler loads or changes a record by an id from the request without checking that the caller may act on that record.
- A request body written onto a persisted model without an allow-list of fields.
- A login, password, or token endpoint in the reviewed code that accepts unlimited attempts.
- When the control that would prevent one of these issues lives outside the reviewed scope, mark that control `[VERIFY]`.

**Prototype pollution**
- A recursive merge, or a deep assignment along a user-controlled path, that can write `__proto__`, `constructor`, or `prototype` through to `Object.prototype`.
- `Object.assign`, and a dynamic write `obj[key] = value` with a user-controlled key, each change the target's prototype when the key is `__proto__`. They leave `Object.prototype` unchanged. Guard `__proto__`, `constructor`, and `prototype`.
- Object spread copies a key named `__proto__` as an ordinary own property and leaves the target's prototype unchanged. Report that key when a later merge or deep assignment walks it.

**Parsing and matching**
- `JSON.parse` on untrusted input with no shape validation or error handling.
- RegExp built from user input (ReDoS), or catastrophic patterns on untrusted strings.

**Failures**
- A `catch` that treats a failed check as success: granting access, skipping validation, or returning the privileged result.

**Secrets and leakage**
- Hardcoded credentials (API keys, private keys, tokens, connection strings) or committed `.env` files anywhere in the repository, not only the reviewed scope. Never reproduce any part of a found secret: cite the path or key only, and recommend rotation.
- Secrets, tokens, or PII in the client bundle, in environment variables the bundler inlines into client code, in URLs, or in logs.
- Stack traces or internal details returned to the user.
- Tokens in `localStorage` or `sessionStorage` when an httpOnly cookie is available; access to web storage not guarded for `SecurityError`.

**Browser surfaces**
- `postMessage` listeners without an origin check, or with `'*'` target origin for sensitive data.
- Content Security Policy weakened by inline scripts or `unsafe-eval`, when the project controls its CSP.
- When the project sets response headers, framing left open: no `frame-ancestors` directive and no `X-Frame-Options`.
- State-changing requests without CSRF protection when the backend relies on cookies.
- Client-side permission checks trusted without server verification.

**Types and dependencies**
- `as unknown as T`, unchecked `any`, or `!` hiding a real null path on untrusted data.
- Production code importing a dev-only dependency.
- Known-vulnerable packages, shown by **Audit command**. Report only with that evidence.
- A dependency added in the change whose install script (`preinstall`, `install`, `postinstall`) runs code. Report it as a `CONCERN` with what the script executes; a script you could not read is `[VERIFY]`.
- A direct dependency resolved to a version the manifest range excludes, or present in the lockfile with no manifest entry. Report both versions.

## Output

```text
[VULN Critical|High|Medium|Low] <file>:<line> — <finding>. Risk: <what an attacker could do>. CWE: <id when one fits>. Fix: <remediation>
[CONCERN Critical|High|Medium|Low] <file>:<line> — <finding>. Context: <why it matters, and what is missing to make it exploitable>. CWE: <id when one fits>. Fix: <remediation>
```

End with the posture (two or three sentences), the open-findings count by class and severity, and up to five remediation priorities.
