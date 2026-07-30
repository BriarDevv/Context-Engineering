# Gap taxonomy

Six categories of what's-missing, walked during step 6 of the protocol.
Each finding needs a suggested resolution, not just the gap.

1. **Missing questions** — decisions nobody made. "Soft or hard delete?
   Cascade to the user's posts? What happens to active sessions?"
2. **Undefined guardrails** — things that need bounds and have none.
   "Retry forever? Max payload? Rate limit for the import endpoint?"
3. **Scope risks** — areas that invite creep. "Also touching the admin panel
   'while we're here' — split it or time-box it."
4. **Unvalidated assumptions** — stated or implied, with a validation method
   each. "Assumes the queue drains nightly — check the cron actually exists."
5. **Missing acceptance criteria** — success must be pass/fail testable.
   "'Faster' is not a criterion; 'p95 < 300ms on the staging dataset' is."
6. **Edge cases** — unusual inputs, states, timing. "Empty list, duplicate
   webhook delivery, concurrent edit, clock skew, first run on a clean DB."

Prioritize by impact × likelihood; don't produce 50 trivia items for a small
feature — the point is the walls the executor will actually hit.
