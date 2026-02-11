# The Middle Way - Web

Web application built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Requirements

- Node.js 18+ 
- npm 9+

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React

## Design System

Features a dual-theme system with a light mode default.

**Themes:**
- **Light Mode**: "Bright Sky" blue palette
- **Dark Mode**: "Deep Cosmos" theme

**Typography:**
- Headings: Playfair Display (Serif)
- Body: Inter (Sans-serif)

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Dashboard/Home page
├── library/page.tsx    # Library page
├── courses/page.tsx    # Courses page
├── profile/page.tsx    # Profile page
├── admin/content/page.tsx # Content management (CSV upload)
└── globals.css         # Global styles & design tokens
components/
└── MobileNavigation.tsx  # Bottom navigation bar
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Runtime URLs

The web app exposes helpers to resolve URLs for `prod`, `preview`, `dev`, `commit`, `version`, and `tag`.

Server-side helper:
`lib/runtime/appInfo.ts`

Client-side helper:
`lib/runtime/publicAppInfo.ts`

Optional env vars (server):
- `APP_URL_PROD`
- `APP_URL_PREVIEW`
- `APP_URL_DEV`
- `APP_URL_COMMIT`
- `APP_URL_VERSION`
- `APP_URL_TAG`
- `APP_VERSION`
- `APP_GIT_TAG`

Client equivalents (if needed on the browser):
- `NEXT_PUBLIC_APP_URL_PROD`
- `NEXT_PUBLIC_APP_URL_PREVIEW`
- `NEXT_PUBLIC_APP_URL_DEV`
- `NEXT_PUBLIC_APP_URL_COMMIT`
- `NEXT_PUBLIC_APP_URL_VERSION`
- `NEXT_PUBLIC_APP_URL_TAG`
- `NEXT_PUBLIC_APP_VERSION`
- `NEXT_PUBLIC_APP_GIT_TAG`

On Vercel, the helpers automatically fall back to system env vars such as
`VERCEL_ENV`, `VERCEL_URL`, `VERCEL_BRANCH_URL`, `VERCEL_PROJECT_PRODUCTION_URL`,
`VERCEL_GIT_COMMIT_SHA`, and `VERCEL_GIT_COMMIT_REF`.

For runtime inspection, `/api/app-info` returns `{ urls, build }`.

## Documentation

Project-wide documentation lives in the [metadata repository](https://github.com/oatrice/TheMiddleWay-Metadata).