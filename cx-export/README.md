# CX Expert — AI Support Operations Portal

Standalone Vite + React + Tailwind v4 frontend.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Backend integration

All network calls flow through `src/services/apiService.ts`. Replace the
soft-stub in `request()` with a real `fetch` to your backend:

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
if (res.status === 401) await authService.refreshSession();
return res.json();
```

Create `.env`:

```
VITE_API_BASE_URL=https://your-backend.example.com
```

`src/services/authService.ts` handles JWT storage, refresh, and
`Authorization: Bearer <token>` headers.

## Expected endpoints

- POST /tickets · GET /tickets · PATCH /users/me · POST /uploads
- POST /auth/login · POST /auth/signup · POST /auth/refresh

## Notes

- Admin role is granted automatically to any email containing `admin`.
- The app forces dark mode (`<html class="dark">`).
