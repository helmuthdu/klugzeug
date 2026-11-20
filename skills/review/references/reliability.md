# Reliability lens

Review only the reliability concerns present in the scope. Trace a write or job through its entry point, persistence or side effects, and caller-visible result. Do not assume infrastructure guarantees that are not in the code or project profile; mark controls outside the scope `[VERIFY]`.

## What to check

- **Persistence and transactions**: related writes that must succeed together are atomic; partial failures do not leave invalid state; persisted invariants are enforced at the appropriate boundary.
- **Concurrency**: concurrent requests or workers cannot silently overwrite newer data, duplicate a non-idempotent effect, or move state through an invalid transition. Check the actual locking, versioning, uniqueness, or compare-and-set mechanism.
- **Retries and idempotency**: retryable operations can be repeated safely or deduplicated; retry limits and terminal failures are observable; retries do not turn permanent failures into endless work.
- **Jobs and recovery**: queued work has explicit success/failure state, handles worker interruption or redelivery, and has a bounded recovery or dead-letter path when the system supports one.
- **Consistency and failure handling**: the caller can distinguish success from failure; external side effects and stored state remain consistent or have an explicit recovery path.
- **Tests**: where tests exist, verify observable success, failure, duplicate delivery, and relevant concurrent or partial-failure behavior without relying only on private calls.

Do not require transactions, queues, retries, or concurrency machinery when the code has no corresponding persistence or asynchronous work. Do not repeat security or performance findings unless there is separate reliability evidence.

Use the standard finding format and severity from `references/contract.md`. Report only source-backed problems; describe the affected operation and its failure impact.
