Closes: https://github.com/owner/repo/issues/1

### Summary

This pull request introduces the "Wisdom Garden" dashboard, the application's core feature. This new, interactive page serves as the user's primary interface for tracking their daily spiritual practices. It replaces the previous static homepage with a dynamic experience that visualizes progress and provides a clear checklist of weekly tasks, as outlined in the issue.

The dashboard is designed to be a calming and motivating space where users can see the tangible results of their efforts, represented by a progress score that will later evolve into a growing "Wisdom Tree."

### Key Changes

*   **New Wisdom Garden Dashboard (`app/page.tsx`)**
    *   The root page is now the main Wisdom Garden screen, orchestrating all new components.
    *   State management is handled using `useState` and `useEffect` to load and manage the data for the selected week.

*   **Component-Based Architecture**
    *   **`AppHeader`**: A new header containing the page title, theme toggle, and the `WeekSelector`.
    *   **`WeekSelector`**: Allows users to navigate between the 8 weeks of the program.
    *   **`WisdomGardenVisualization`**: Displays the user's current score and max score for the week, providing immediate visual feedback.
    *   **`PracticeChecklist` & `PracticeCard`**: Renders a categorized list of practices. The cards are interactive, with smooth animations and visual state changes upon completion.

*   **State Persistence with `localStorage`**
    *   User progress (i.e., checked items) is automatically saved to the browser's `localStorage`.
    *   This ensures that a user's progress is preserved across sessions and page reloads, providing a seamless and reliable experience.

*   **Data Structure & Types**
    *   `lib/data/wisdom-garden-data.ts`: Mock data has been created to simulate the 8-week practice program.
    *   `lib/types/wisdom-garden.ts`: Clear TypeScript types have been defined for all data structures related to the feature.

*   **Technical Refinements**
    *   **Immutable State Updates**: The checklist handler (`handleCheckItem`) was implemented to use an immutable update pattern, ensuring predictable state changes and preventing side effects.
    *   **`ThemeProvider` Refactor**: Optimized the theme provider to better synchronize the theme state between the UI and persistent storage.

### Screencast

*A short demo of the new dashboard in action.*

https://github.com/user-attachments/assets/b8321a57-0a9c-4f51-b841-591e6005d5e5

### How to Test

1.  Navigate to the homepage (`/`).
2.  The "Wisdom Garden" dashboard should be displayed.
3.  Click on any practice item in the checklist.
    *   **Expected:** The item marks as complete, its appearance changes, and the score at the top updates instantly.
4.  Click the same item again to uncheck it.
    *   **Expected:** The item returns to its original state, and the score decreases.
5.  Use the week selector at the top to switch to a different week (e.g., Week 2).
    *   **Expected:** The checklist and score update to reflect the data for the selected week.
6.  Check a few items, then refresh the browser page.
    *   **Expected:** The items you checked should remain checked, confirming that the state was persisted correctly in `localStorage`.