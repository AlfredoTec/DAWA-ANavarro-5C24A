# Material UI Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Tailwind-heavy auth UI with a clean Material UI interface while preserving current auth behavior.

**Architecture:** Add a client-side Material UI provider at the root, then migrate each existing page to MUI primitives without changing data flow. Keep components small and avoid touching `proxy.ts`.

**Tech Stack:** Next.js 16 App Router, React 19, NextAuth v4, Material UI, Emotion, TypeScript.

---

## File Structure

- Create `components/MuiThemeProvider.tsx`: client wrapper for `ThemeProvider` and `CssBaseline`.
- Modify `app/layout.tsx`: wrap existing `AuthSessionProvider` content with `MuiThemeProvider`.
- Modify `components/LogoutButton.tsx`: replace Tailwind button with MUI danger button.
- Modify `app/page.tsx`: Material UI landing/auth entry screen.
- Modify `app/signIn/page.tsx`: Material UI credentials and OAuth sign-in form.
- Modify `app/register/page.tsx`: Material UI registration form.
- Modify `app/dashboard/page.tsx`: Material UI account summary card.
- Modify `app/profile/page.tsx`: Material UI profile details card.
- Modify `package.json` and `package-lock.json`: add Material UI dependencies through `npm install`.

## Task 1: Install Material UI

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install dependencies**

Run:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Expected: `package.json` contains the four dependencies and install exits with code 0.

- [ ] **Step 2: Check dependency state**

Run:

```bash
npm ls @mui/material @emotion/react @emotion/styled @mui/icons-material
```

Expected: all four packages resolve under `next-auth-app@0.1.0`.

## Task 2: Add MUI Root Provider

**Files:**
- Create: `components/MuiThemeProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create theme provider**

Create `components/MuiThemeProvider.tsx`:

```tsx
"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1d4ed8",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
});

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Wrap layout**

Update `app/layout.tsx`:

```tsx
import MuiThemeProvider from "@/components/MuiThemeProvider";
```

Wrap body children:

```tsx
<body className="min-h-full flex flex-col">
  <MuiThemeProvider>
    <AuthSessionProvider>{children}</AuthSessionProvider>
  </MuiThemeProvider>
</body>
```

## Task 3: Migrate Shared Logout Button

**Files:**
- Modify: `components/LogoutButton.tsx`

- [ ] **Step 1: Replace button**

Use MUI:

```tsx
"use client";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      color="error"
      onClick={() => signOut({ callbackUrl: "/" })}
      startIcon={<LogoutRoundedIcon />}
      variant="outlined"
    >
      Cerrar sesion
    </Button>
  );
}
```

## Task 4: Migrate Pages

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/signIn/page.tsx`
- Modify: `app/register/page.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Replace layout primitives**

Use these MUI imports as needed:

```tsx
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
```

- [ ] **Step 2: Preserve behavior**

Keep existing auth calls:

```tsx
signIn("credentials", { email: form.email, password: form.password, redirect: false });
signIn("google", { callbackUrl: "/dashboard" });
signIn("github", { callbackUrl: "/dashboard" });
fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
signOut({ callbackUrl: "/" });
```

- [ ] **Step 3: Preserve protection redirects**

Keep existing effects:

```tsx
useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/signIn");
  }
}, [status, router]);
```

Home keeps authenticated redirect:

```tsx
useEffect(() => {
  if (status === "authenticated") {
    router.push("/dashboard");
  }
}, [status, router]);
```

- [ ] **Step 4: Use accessible loading and alerts**

Use `CircularProgress` for loading pages/buttons and `Alert` for errors/success.

## Task 5: Verify

**Files:**
- No direct edits.

- [ ] **Step 1: Lint**

Run:

```bash
npm run lint
```

Expected: exits 0.

- [ ] **Step 2: Typecheck**

Run:

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Run dev server**

Run:

```bash
npm run dev
```

Expected: local URL available.

- [ ] **Step 4: Browser check**

Open `/`, `/signIn`, `/register`, `/dashboard`, `/profile`. Expected: pages render with Material UI, unauthenticated protected pages redirect to `/signIn`, no layout overlap on desktop/mobile widths.
