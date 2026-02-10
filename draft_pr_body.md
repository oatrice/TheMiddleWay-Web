This pull request implements the foundational design system for the application, addressing colors and typography as outlined in the issue. It introduces a robust dual-theme system (light and dark modes) and updates the font stack for a more modern aesthetic.

Closes: https://github.com/owner/repo/issues/4

### Key Changes

#### 1. Dual-Theme System (Light & Dark Mode)
A comprehensive themeing system has been implemented to allow users to switch between a light and a dark mode. The selected theme is persisted in `localStorage`.

-   **Dark Theme ("Deep Cosmos"):** Utilizes a deep navy blue background (`#0A192F`) for a focused, low-light experience.
-   **Light Theme ("Bright Sky"):** Features a clean, bright palette for optimal daytime readability.
-   **Accent Color:** A vibrant amber (`#F59E0B`) is used as the primary accent color across both themes to highlight interactive elements.
-   **CSS Variables:** The color palette is defined using CSS variables scoped under `[data-theme="light"]` and `[data-theme="dark"]` in `app/globals.css`. Components now use semantic variable names (e.g., `bg-surface`, `text-primary`, `border-border`) for theme-agnostic styling.

#### 2. Theme Management Architecture
To manage the theme state, the following have been created:
-   **`useTheme` Hook:** A custom hook that handles the core logic of reading from/writing to `localStorage`, applying the `data-theme` attribute to the `<html>` element, and providing state.
-   **`ThemeProvider` Context:** Wraps the application to provide global access to the current theme and the toggle function.
-   **`ThemeToggle` Component:** A new UI component in the header that allows users to seamlessly switch between light and dark modes, complete with a smooth `framer-motion` animation.

#### 3. Typography Update
The application's typography has been refreshed to better align with the new design direction:
-   The serif font `Playfair_Display` has been replaced with the modern sans-serif font **`Outfit`** for all headings and display text.
-   `Inter` is retained as the primary font for body copy and UI elements.

#### 4. UI Redesign and Refinements
The home page (`app/page.tsx`) has been significantly redesigned to showcase the new design system.
-   **Visual Polish:** Elements now feature subtle borders, background blurs, gradients, and improved hover states.
-   **Animations:** `framer-motion` has been integrated to add subtle entry animations to page elements, enhancing the user experience.
-   **Component Updates:** Existing components, such as `MobileNavigation`, have been updated to use the new theme variables.

### How to Test

1.  Pull down the branch and run the application.
2.  The application should load in **light mode** by default.
3.  Locate the new **sun/moon icon** in the header and click it.
4.  The UI should smoothly transition to the dark "Deep Cosmos" theme.
5.  Verify that all text, backgrounds, and interactive elements have adapted correctly.
6.  Refresh the page. The selected (dark) theme should persist.
7.  Switch back to light mode and confirm persistence on refresh.
8.  Inspect the headings (e.g., "The Middle Way") and confirm they are using the **Outfit** font.