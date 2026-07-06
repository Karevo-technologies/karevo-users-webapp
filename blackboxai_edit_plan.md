# Edit plan: integrate NotFound page

## Information Gathered

- The app uses **react-router-dom** with `Routes` and `Route` in **src/App.tsx**.
- Current behavior:
  - If `!isAuthenticated`, routes are only `/login`, `/register`, and a `path="*"` redirect to `/login`.
  - If `isAuthenticated`, routes are only `/dashboard` and `path="*"` redirect to `/dashboard`.
- A NotFound component exists at **src/notfound.tsx**, but it appears to be written like a **Next.js** component:
  - It imports `Link` from `next/link`.
  - In this codebase we must use `Link` from `react-router-dom`.

## Plan (file-by-file)

1. **src/notfound.tsx**
   - Replace `import Link from "next/link"` with `import { Link } from "react-router-dom"`.
   - Ensure JSX uses router `Link` safely (same props: `to` instead of `href`).
2. **src/App.tsx**
   - Import `NotFound` from `./notfound`.
   - In both authenticated and unauthenticated branches, replace the current `path="*"` redirect target with `<NotFound />`.
   - Add an additional catch-all for authenticated routes if needed (but `path="*"` inside each branch is sufficient).
3. **TODO.md**
   - Update checklist items as steps complete.

## Dependent Files to be edited

- src/notfound.tsx
- src/App.tsx
- TODO.md

## Followup steps after editing

- Run `npm test` / `npm run build` / `npm run lint` (whichever exists) to confirm TypeScript compiles.

<ask_followup_question>
Confirm whether you want unknown routes to show the 404 page:

- For **unauthenticated** users: show NotFound (not redirect to /login)
- For **authenticated** users: show NotFound (not redirect to /dashboard)

If yes, I will proceed to implement the changes.
</ask_followup_question>
