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

**Warm Modern Sanctuary** palette (matching Android & iOS):

| Token | Color | Usage |
|-------|-------|-------|
| Ivory | `#FCF9F6` | Background |
| Sage | `#8B9D83` | Primary Accent |
| Slate | `#2D3748` | Text |
| Sand | `#F3F0ED` | Surface/Cards |

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

## Documentation

Project-wide documentation lives in the [metadata repository](https://github.com/oatrice/TheMiddleWay-Metadata).
