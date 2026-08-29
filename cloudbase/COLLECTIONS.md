# CloudBase collections for 风里约行

Create these collections in the CloudBase console before deploying the API function:

- `users`: only through cloud function; no client direct access.
- `routes`: public read through cloud function; write only by owner via cloud function.
- `plans`: private per user; created when a route is adopted as a personal plan.
- `route_saves`: legacy private saves; do not use for new plan flows.
- `invitations`: route-based, visibility governed by cloud function.
- `invitation_members`: private membership records.
- `conversations`: only participants may read via cloud function.
- `messages`: only conversation participants may read via cloud function.
- `reports`: write-only from user perspective; moderation-only read.
- `blocks`: private per user.

Do not give client-side “all users read/write” database permissions. The `api` cloud function must enforce ownership and participant checks for every request.
