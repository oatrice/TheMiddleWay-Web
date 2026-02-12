# Changelog

## [0.6.0] - 2026-02-12

### Added

- Introduced a new "Weekly Practices" page to provide a comprehensive view of all available practices.
- Added toast notifications to the Wisdom Garden to inform users when they attempt to interact with a read-only checklist.
- Implemented a CI workflow to automatically generate preview deployments on Vercel for each pull request, improving the development and review process.

### Changed

- Refactored Wisdom Garden state management into a dedicated `useWisdomGarden` hook for improved code structure and reusability.

## [0.5.0] - 2026-02-12

### Added

- Implemented the 'Wisdom Garden' feature on the homepage, a new interactive interface for tracking weekly practices. This includes a dynamic progress visualization, practice cards, a checklist, and a week selector.

### Changed

- Refactored the homepage and `ThemeProvider` for improved performance, cleaner state management, and better code maintainability.
- Optimized theme context actions to prevent unnecessary re-renders.

### Fixed

- Corrected a state management bug in the Wisdom Garden checklist to ensure that checking or unchecking a practice is always reflected accurately in the UI.

## [0.4.0] - 2026-02-11

### Added

- **Admin Content Management:** Introduced a new page for administrators to bulk-upload course content using a CSV file.
- **Backend API Integration:** Integrated the frontend with the Go backend service to process and store uploaded content, migrating the logic from the client.
- **Deployment Automation:** Implemented new CI/CD workflows to automatically create Git tags on version updates and to generate version-specific deployment URLs on Vercel.

## [0.3.0] - 2026-02-11

### Added

- Implemented user progress tracking, which automatically saves course and lesson completion status to the browser's local storage.
- Added a developer debug tool on the Profile page to inspect and manage saved progress data.

### Fixed

- Corrected a dependency issue in the theme initialization hook to ensure theme stability and prevent potential rendering bugs.

## [0.2.0] - 2026-02-10

### Added

- Implemented a dual-theme system with support for both Light and Dark modes.
- Introduced two new themes: a "Bright Sky" light theme and a "Deep Cosmos" dark theme.
- Added a theme toggle button to allow users to switch between light and dark modes.

### Changed

- Overhauled the application's color palette and styling to support the new theming system.
- Set the "Bright Sky" light theme as the new default for first-time visitors.

All notable changes to this project will be documented in this file.
The format is based on Keep a Changelog.

---

## [0.1.1] - 2026-02-06

### Changed

- Moved roadmap and feature documentation to the metadata repository.
- Replaced root README with a web-only README.

---

## [0.1.0] - 2026-02-05

### Added

- Initial Next.js 16 App Router + TypeScript scaffolding
- Tailwind CSS v4 styling
- Framer Motion animations
- Lucide React icons
- Base pages: Dashboard, Library, Courses, Profile
