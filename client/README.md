## WorkOS Frontend Take‑Home — Client

### Quick start
- Prereq: Node.js 18+.
- Install all deps from repo root:
  - `npm run install:all`
- Start both API and client from repo root:
  - `npm run dev`
  - Client: `http://localhost:5173`
  - API: `http://localhost:3002`
- Alternatively if you want to run the client and api separately:
  - API: `cd server && npm install && npm run api`
  - Client: `cd client && npm install && npm run dev`

### What’s implemented
- Users/Roles tabs with URL‑synced state (tab, page, search)
- Users table with search filter (debounced) and actions menu
- Delete user flow with confirmation dialog
- Roles table with search filter (debounced) and actions menu
- Rename role and update description via modal
- Pagination with numbered pages

### Notable decisions
- Used Shadcn components (built on Radix primitives) for fast, accessible building blocks.
- React Query for caching and simple invalidation on mutations.
- Tailwind with a small design token layer to match the provided styles.
- Lightweight URL sync for tab/page/search so refresh/back/forward behave predictably.
- Uses a single data table for smooth transitions between users and roles

### Design deviations/decisions
- Pagination: Added page numbers (max 5 visible) in addition to previous/next. This makes it faster to jump across pages and keeps you oriented on the current page.
- Responsiveness: The table is intentionally non‑responsive (fixed width) to make review against the Figma easier.

### Known issues and follow‑ups (ie if I had more time)
- Surface errors and confirmations via non‑blocking toasts.
- Add photo fallback with initials (first letter of first name) and descriptive `alt` (e.g., "Profile photo of Jane Doe").
- Add any missing aria labels/roles.
- Add table loading skeletons and optimistic UI updates for delete/rename.
- Add unit tests for data hooks and components; Playwright for basic flows.
- Use React Router or similar for better URL state management
- Implement all the functionality that exists in the UI but isn't actually hooked up
- Add a responsive table view
- Add full color palettes/theming 
- Storybook for base components 
- I downloaded the test font files for untitled sans - this provides a limited subset of characters to work with. There may be some visual disparities due to this. 

---

If you run into any issues starting the app, please reach out — happy to help.
