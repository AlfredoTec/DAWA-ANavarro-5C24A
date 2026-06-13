# Material UI Frontend Design

## Goal

Improve the existing Next.js authentication frontend with Material UI while keeping current behavior intact.

## Scope

- Convert existing auth and protected pages to Material UI components:
  - `app/page.tsx`
  - `app/signIn/page.tsx`
  - `app/register/page.tsx`
  - `app/dashboard/page.tsx`
  - `app/profile/page.tsx`
  - `components/LogoutButton.tsx`
- Add a Material UI theme/provider at the application root.
- Install Material UI dependencies.
- Keep routes, NextAuth logic, redirects, API calls, and Spanish copy unchanged except small UI wording needed for clarity.
- Avoid touching `proxy.ts`, which already has uncommitted changes.

## Visual Direction

Use the approved "limpio academico" direction:

- Light-first interface with institutional blue primary color.
- Clean cards using `Paper` with modest elevation and 8px-12px radius.
- Clear form hierarchy with visible labels and helper/error feedback.
- Restrained spacing, no decorative gradients or marketing hero layout.
- Dashboard and profile remain compact, centered, and focused on account information.

## Architecture

- Add a small client-side MUI registry/provider component so `ThemeProvider` and `CssBaseline` can wrap the App Router tree from `app/layout.tsx`.
- Keep page components as client components where they currently depend on `useSession`, `useRouter`, `useSearchParams`, or local form state.
- Use MUI layout primitives (`Container`, `Box`, `Stack`, `Paper`) instead of Tailwind utility-heavy cards.
- Use MUI form and feedback primitives (`TextField`, `Button`, `Alert`, `Divider`, `CircularProgress`).
- Use MUI display primitives (`Typography`, `Avatar`, `Chip`) for user info.

## Data Flow

- Sign-in keeps `signIn("credentials", { redirect: false })`, error handling, and redirect to `/dashboard`.
- OAuth buttons keep `signIn("google")` and `signIn("github")`.
- Registration keeps `fetch("/api/auth/register")`, error handling, and redirect to `/signIn?registered=true`.
- Dashboard/profile keep `useSession()` protection and redirect unauthenticated users to `/signIn`.
- Logout keeps `signOut({ callbackUrl: "/" })`.

## Error Handling

- Render success and error messages with MUI `Alert`.
- Disable submit buttons during async requests.
- Show `CircularProgress` in submit buttons during loading.
- Preserve required fields and password `minLength={6}`.

## Accessibility

- Keep one descriptive `h1` per page for Next route announcements.
- Use visible `TextField` labels and semantic input types.
- Preserve focus styles through MUI defaults.
- Use button text plus icons for OAuth actions, not icon-only controls.
- Use accessible image labels through `Avatar` alt text.

## Testing

- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Start local dev server and manually verify main screens:
  - `/`
  - `/signIn`
  - `/register`
  - protected dashboard/profile render when authenticated or redirect when unauthenticated.

## Out Of Scope

- Backend/API changes.
- Auth behavior changes.
- New dashboard features.
- Dark-mode toggle.
- Editing `proxy.ts`.
