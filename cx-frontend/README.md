# CX Expert AI Support Portal

A **frontend-only** support operations portal with a dark neon
(blue + purple) cyber-tech aesthetic. Built with React, TypeScript,
React Router, Tailwind CSS v4, and Recharts.

> No backend, no database, no APIs, no authentication logic.
> All data is mocked. The backend team will wire real APIs later.

## Features

- Role-based mock sign-in (User, Agent, Admin) using `localStorage`
- **User Dashboard** — submit tickets, profile, appearance settings
- **Agent Dashboard** — ticket queue, filters, profile
- **Admin Dashboard** — operations, reports, assignment, SLA tracking
- Neon glass UI with glow effects and animated cyber grid
- Recharts visualizations (line, area, bar, pie)
- Responsive layout with collapsible sidebar
- Light / Dark theme toggle

## Tech Stack

- React 18 + TypeScript
- React Router DOM
- Tailwind CSS v4 (tokens in `src/styles.css`)
- Recharts
- lucide-react icons
- Vite

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# build for production
npm run build

# preview the production build
npm run preview
```

Open the printed URL in your browser. Sign in with any email + password
(4+ characters) and choose a role.

## Project Structure

```
cx-expert-ai-support-portal/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx                # React entry
    ├── App.tsx                 # Routes
    ├── styles.css              # Design tokens & Tailwind
    ├── components/
    │   ├── DashboardShell.tsx  # Sidebar + header layout
    │   └── StatCard.tsx        # Neon stat card
    ├── lib/
    │   ├── utils.ts            # cn() helper
    │   ├── mock-auth.ts        # localStorage mock auth
    │   ├── mock-data.ts        # tickets, departments, charts
    │   └── admin-nav.ts        # admin sidebar items
    └── pages/
        ├── Login.tsx
        ├── Register.tsx
        ├── UserHome.tsx
        ├── UserSubmit.tsx
        ├── UserProfile.tsx
        ├── UserSettings.tsx
        ├── AgentHome.tsx
        ├── AgentTickets.tsx
        ├── AgentProfile.tsx
        ├── AdminHome.tsx
        ├── AdminReports.tsx
        ├── AdminUsers.tsx
        ├── AdminAI.tsx
        ├── AdminCases.tsx
        ├── AdminKnowledge.tsx
        └── AdminConfig.tsx
```

## Notes

- All ticket data lives in `src/lib/mock-data.ts`.
- Mock auth uses `localStorage` — no users are created on a real backend.
- The submit-ticket form runs validation locally and shows a success
  message. It does **not** send anything to a server.
- SLA rule: office hours 08:00–16:00; tickets older than 7 hours are
  flagged as breached.
- Theme tokens (neon blue, neon purple, glassmorphism, glows) live in
  `src/styles.css`.

## License

MIT
