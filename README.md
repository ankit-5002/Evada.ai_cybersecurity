# EVADA Customer Frontend

Customer-facing EVADA web application built with Next.js, React, TypeScript and Tailwind CSS.

## Responsibilities

- Public product pages
- Customer signup, verification, login and password recovery
- Enterprise workspace and permission-aware navigation
- Team Member setup and organization access
- Assets, scans, findings, reports, agents and AI module interfaces

This application calls `evada-be`. It must never connect directly to a tenant database or `evada-admin-be`.

## Local Development

```powershell
cd D:\Evada_new\evada-fe
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`. The customer API normally runs at `http://localhost:8000`.

## Verification

```powershell
npm run lint
npm run build
```

CI runs both commands on every pull request and push to `main`.

## Security Boundary

- Keep tokens and secrets out of source control.
- Only `NEXT_PUBLIC_*` values are browser-visible, so they must never contain credentials.
- Frontend permission hiding is user experience only; `evada-be` remains the authorization authority.
- Do not commit `.env*`, `.next`, `node_modules`, logs or local certificates. `.env.example` is the only environment template tracked.
