<div align="center">

# RentDesk

### Modern Property Management Platform

A production-grade, multi-tenant property management SaaS built with Next.js 16, React 19, and a custom design system inspired by Stripe and AppFolio.

**Next.js 16** · **React 19** · **TypeScript** · **Tailwind CSS v4** · **shadcn/ui** · **Radix UI**

[Tech Stack](#tech-stack) · [Architecture](#architecture) · [Design System](#design-system) · [Features](#features) · [Getting Started](#getting-started)

</div>

---

## Overview

RentDesk is a full-stack property management platform that enables landlords, property managers, tenants, and vendors to manage their rental portfolios through a unified, role-based dashboard. The frontend is a performant, accessible, and beautifully designed Next.js application with a custom design system, strict type safety, and enterprise-grade code quality tooling.

## Tech Stack

| Layer                 | Technology                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Framework**         | [Next.js 16](https://nextjs.org/) with App Router & Turbopack                                   |
| **UI Library**        | [React 19](https://react.dev/) with Server Components                                           |
| **Language**          | [TypeScript 5.9](https://www.typescriptlang.org/) — strict mode                                 |
| **Styling**           | [Tailwind CSS v4](https://tailwindcss.com/) via PostCSS                                         |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) primitives          |
| **Forms**             | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) schema validation |
| **Data Fetching**     | [TanStack React Query 5](https://tanstack.com/query)                                            |
| **Tables**            | [TanStack React Table 8](https://tanstack.com/table) — sorting, pagination, filtering           |
| **URL State**         | [nuqs](https://nuqs.47ng.com/) — type-safe URL search params                                    |
| **Theming**           | [next-themes](https://github.com/pacocoursey/next-themes) — light/dark mode                     |
| **Icons**             | [Lucide React](https://lucide.dev/)                                                             |
| **Notifications**     | [Sonner](https://sonner.emilkoez.dev/) toast system                                             |

### Developer Experience

| Tool                        | Purpose                                                                          |
| --------------------------- | -------------------------------------------------------------------------------- |
| **ESLint 9** (flat config)  | 8 plugins — boundaries, import sort, a11y, unused imports, file naming, Tailwind |
| **Prettier**                | Code formatting with Tailwind class sorting                                      |
| **Husky**                   | Git hooks — pre-commit lint-staged, commit-msg validation, pre-push protection   |
| **commitlint**              | Conventional commits enforcement (`feat`, `fix`, `chore`, `refactor`, etc.)      |
| **lint-staged**             | Runs ESLint + Prettier on staged files only                                      |
| **Custom ship-it pipeline** | Automated branch → main merge with dual build validation                         |

## Architecture

```
rentdesk/frontend
├── app/                          # Next.js App Router (thin route wrappers)
│   ├── (auth)/                   # Auth route group — centered layout
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── magic-link/
│   │   └── reset-password/
│   └── (dashboard)/              # Dashboard route group — sidebar layout
│       ├── properties/           # CRUD + nested units
│       ├── leases/               # CRUD + renewals + termination
│       ├── tenants/              # CRUD + profile + lease history
│       ├── landlord/             # Landlord dashboard
│       ├── manager/              # Manager dashboard
│       ├── tenant/               # Tenant dashboard
│       └── vendor/               # Vendor dashboard
│
├── features/                     # Feature-based modules (domain logic)
│   ├── auth/                     # Auth forms, services, schemas
│   ├── dashboard/                # Sidebar, topbar, layout shell
│   ├── properties/               # Property & unit management
│   ├── leases/                   # Lease lifecycle management
│   └── tenants/                  # Tenant management
│
├── shared/                       # Cross-feature shared code
│   ├── components/
│   │   └── ui/                   # 26 shadcn/ui primitives
│   ├── hooks/                    # Custom React hooks
│   ├── contexts/                 # Auth context + providers
│   ├── types/                    # Shared TypeScript types
│   ├── constants/                # Route constants, labels
│   ├── config/                   # Zod-validated env config
│   └── lib/                      # Utilities (cn, apiClient)
│
└── .claude/                      # AI-assisted development tooling
    └── scripts/ship-it.sh        # Automated merge + build pipeline
```

### Key Architectural Decisions

- **Feature-based module structure** — Each domain (properties, leases, tenants) is self-contained with its own components, pages, services, and schemas. Cross-feature imports are blocked by ESLint boundary rules.
- **Thin app routes** — `app/` directory contains only Next.js route wrappers that delegate to feature page components. Zero business logic in route files.
- **Service layer abstraction** — All API communication lives in feature-level `services/` directories. Components never call APIs directly.
- **Type-safe forms** — Every form uses Zod schemas as the single source of truth, shared between validation and TypeScript types.
- **Role-based access** — Auth guard component with route protection for 4 user roles: landlord, manager, tenant, vendor.

## Design System

RentDesk uses a bespoke design system built on top of shadcn/ui, inspired by **Stripe's clarity** and **AppFolio's domain warmth**.

### Brand Palette

| Token        | Hex       | Role                                  |
| ------------ | --------- | ------------------------------------- |
| **Jade 500** | `#1F7359` | Primary — trust, professionalism      |
| **Clay 400** | `#D97757` | Accent — warmth, calls to action      |
| **Paper**    | `#FAFAF7` | Background canvas — warm, not sterile |
| **Ink 900**  | `#111110` | Primary text — near-black warmth      |

### Typography

| Font                 | Usage                       |
| -------------------- | --------------------------- |
| **Geist**            | Body text, UI labels        |
| **Instrument Serif** | Display headings, hero text |
| **Geist Mono**       | Code, data, tabular numbers |

### Design Tokens

- **Radius**: 8px house rule (consistent across all components)
- **Spacing**: 4px base grid
- **Shadows**: Two-stop pattern calibrated for warm paper backgrounds
- **Colors**: Full 9-step jade, clay, and ink scales + semantic status colors
- **Dark mode**: Hand-crafted dark theme (not auto-inverted)

### Component Library — 26 Primitives + 13 Custom

**shadcn/ui Primitives**: Alert Dialog, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Collapsible, Command, Dialog, Dropdown Menu, Input, Input Group, Label, Password Input, Popover, Select, Separator, Sheet, Sidebar, Skeleton, Sonner, Table, Tabs, Textarea, Tooltip

**Custom Components**: Auth Guard, Combobox, Multi-Combobox, Confirm Dialog, Data Table, Date Range Display, Empty State, Page Header, Search Input, Status Badge, User Avatar, Providers, Theme Provider

## Features

### Properties & Units

- Full CRUD for properties with address management
- Nested unit management (create, edit, detail views)
- Property type filtering and search
- Table/grid view toggle with server-side pagination
- Occupancy stats, rent roll, and vacancy tracking
- Archive functionality with confirmation dialogs

### Leases

- Complete lease lifecycle — create, edit, renew, terminate
- Multi-tenant lease support with primary tenant designation
- Date range handling and financial tracking
- Deposit settlement workflow on termination
- Status-based UI with contextual actions

### Tenants

- Tenant profiles with contact information and emergency contacts
- Lease history tracking across properties
- Inline status management (active/inactive)
- Linked navigation to associated leases and units

### Authentication

- Login, register, forgot password, magic link, and password reset flows
- Role-based routing (landlord, manager, tenant, vendor dashboards)
- Protected routes with auth guard
- Session persistence

### Dashboard Shell

- Responsive sidebar navigation with collapsible groups
- Role-aware menu items
- Light/dark theme toggle
- Mobile-optimized sheet navigation
- Breadcrumb-based page headers

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/muneebulhassanpak/rentdesk-web.git
cd rentdesk-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start dev server with Turbopack
npm run dev

# Type checking
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Run all checks
npm run check:all
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## Code Quality

This project enforces strict code quality at every level:

- **TypeScript strict mode** — No `any`, no implicit returns, strict null checks
- **ESLint flat config** with 8 plugins:
  - `boundaries` — Enforces feature module isolation
  - `check-file` — Enforces file naming conventions (kebab-case with dot suffixes)
  - `simple-import-sort` — Deterministic import ordering
  - `jsx-a11y` — Accessibility linting
  - `unused-imports` — Dead import removal
  - `tailwindcss` — Tailwind class validation
  - `react` + `react-hooks` — React best practices
  - `import` — Import/export validation
- **Conventional commits** — Every commit follows `type(scope): description`
- **Pre-commit hooks** — Lint-staged runs ESLint + Prettier on every commit
- **Pre-push protection** — Prevents direct pushes to main branch
- **Ship-it pipeline** — Automated merge workflow with build validation on both feature branch and main

---

<div align="center">

Built with precision by **Muneeb ul Hassan**

</div>
