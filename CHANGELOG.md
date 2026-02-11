# Changelog

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
