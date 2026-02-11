Closes https://github.com/owner/repo/issues/6, https://github.com/oatrice/TheMiddleWay-Metadata/issues/15

### Summary

This pull request introduces a crucial infrastructure component: a persistence layer using the browser's `localStorage`. This system is designed to track and save user progress, including completed lessons, bookmarks, and application settings (like theme and language). By persisting this data, we ensure a seamless user experience across sessions, as users will not lose their progress upon refreshing the page or returning to the app later.

The implementation is centered around a new `ProgressProvider` that acts as a global state manager, syncing automatically with `localStorage`.

### Key Changes

*   **`persistenceService.ts`:** A new, dedicated service has been created to abstract all direct interactions with `localStorage`. It provides three core functions: `saveProgress`, `loadProgress`, and `clearProgress`. This centralizes persistence logic and makes it easily testable.

*   **`ProgressProvider` and `useProgress` Hook:**
    *   Implemented a global state provider using `React.Context` and the `useReducer` hook for robust state management.
    *   This provider wraps the entire application (`app/layout.tsx`) to make progress data available everywhere.
    *   It automatically loads saved data from `localStorage` on initial mount and auto-saves any subsequent changes to the progress state.

*   **Theme Persistence Refactor:**
    *   The `ThemeProvider` and `useTheme` hook have been refactored.
    *   Instead of managing their own `localStorage` state, they now sync bi-directionally with the `ProgressProvider`. This consolidates all persisted state into a single, unified `UserProgress` object.

*   **Developer Debug Tool (`DebugProgressControl.tsx`):**
    *   A new debug component has been added to the `/profile` page to facilitate easy testing and verification.
    *   It displays the live `progress` state object as JSON.
    *   It includes buttons to trigger state changes (e.g., complete a lesson, toggle language, reset data) to confirm persistence works correctly after a page refresh.

*   **Comprehensive Unit Testing:**
    *   Added extensive unit tests using Vitest to ensure the reliability of the new system.
    *   Tests cover the `persistenceService` functions (`lib/services/__tests__/persistenceService.test.ts`).
    *   Tests also cover the `ProgressProvider` and `useProgress` hook, including state updates, initialization, and auto-saving logic (`components/__tests__/ProgressProvider.test.tsx`).

*   **CI Workflow Enhancement:**
    *   The CI pipeline (`.github/workflows/web-ci.yml`) has been updated to include a `test` step, ensuring that all tests are automatically executed on every push to maintain code quality.

### How to Test

1.  Navigate to the `/profile` page.
2.  You should see a new **"🛠️ Debug: Persistence Control"** section.
3.  Click the buttons to modify the state, for example:
    *   "✅ Complete Lesson (Random)"
    *   "🌐 Toggle Lang"
4.  Observe the JSON data updating in the debug view.
5.  **Refresh the page.**
6.  **Verification:** The state you set in the previous steps should still be present in the debug view, confirming that the data was successfully reloaded from `localStorage`.
7.  (Optional) Open your browser's DevTools (Application -> Local Storage) and inspect the `theMiddleWay.progress` key to see the raw stored data.
8.  Click the "⚠️ Reset All Data" button and refresh the page. The state should revert to its default values.

#### Screenshot of the Debug Tool  <!-- Replace with actual screenshot -->