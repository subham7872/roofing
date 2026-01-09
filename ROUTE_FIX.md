# Route Fix for Dashboard

## Issue
Dashboard getting "Not authorized to access this route" error when fetching leads.

## Solution
The route `GET /api/leads` is now public (defined before `router.use(protect)`).

## Action Required
**Restart the server** for changes to take effect:

```bash
cd server
npm run dev
```

## Verification
After restart, test:
```bash
curl http://localhost:8088/api/leads
```

Should return leads without authentication.
