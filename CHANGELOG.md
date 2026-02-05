# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] - 2026-02-05

### Added

- **Initial Project Setup**
  - Next.js 16.1.6 with App Router and TypeScript
  - Tailwind CSS v4 for styling
  - Framer Motion for animations
  - Lucide React for iconography

- **Design System (Warm Modern Sanctuary)**
  - Custom color palette: Ivory, Sage, Slate, Sand
  - Typography: Playfair Display (headings) + Inter (body)
  - Custom border-radius: `rounded-pill` (40px), `rounded-card` (1rem)
  - Mobile-first responsive configuration

- **Folder Structure**
  - `/components/ui` - Atomic components
  - `/components/layout` - Navigation and headers
  - `/lib` - Utility functions
  - `/hooks` - Custom React hooks

- **Initial Shell**
  - Root layout with Google Fonts
  - Mobile Navigation Bar (fixed bottom) with 4 tabs
  - Dashboard placeholder page
  - Library, Courses, Profile placeholder pages

### Technical Details

- Viewport configured for mobile-first with safe-area support
- Static page generation for all routes
- ESLint configuration included
