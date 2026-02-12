Closes https://github.com/owner/repo/issues/2

### Summary

This pull request introduces the new **"ห้องปฏิบัติธรรม" (Weekly Practices & Checklist)** page, a dedicated space for users to actively engage with their weekly tasks. This separates the interactive "doing" part from the "viewing" part, which remains on the Dashboard.

The Dashboard (now named "สวนแห่งปัญญา" or Wisdom Garden) has been updated to be a read-only summary of the user's progress. It now features a prominent call-to-action button that directs users to the new Practice Room. To enhance user experience, attempting to interact with the checklist on the Dashboard will trigger a toast notification, guiding them to the correct page for making changes.

A significant part of this work involved a major refactor of the state management. All logic related to fetching, updating, and persisting checklist data is now encapsulated within a new reusable `useWisdomGarden` hook, leading to cleaner components and more maintainable code.

### Key Changes

*   **✨ New Page: `/weekly-practices`**
    *   Creates a new, focused page for users to view and check off their weekly practice items.
    *   This page is fully interactive, allowing users to toggle the completion status of each task.

*   **🏡 Dashboard Update (`/`)**
    *   The checklist on the main page is now **read-only** to serve as a high-level summary.
    *   A "Go to Practice Room" button has been added for clear navigation.
    *   A toast notification now appears if a user tries to click the read-only checklist, preventing confusion.

*   **⚛️ Refactor: `useWisdomGarden` Custom Hook**
    *   Centralized all state management logic into a single hook (`useWisdomGarden`).
    *   This hook handles:
        *   Selecting the current week.
        *   Loading weekly data from `localStorage` with a fallback to mock data.
        *   Persisting changes back to `localStorage`.
        *   Toggling the completion state of practice items.
        *   Syncing state between browser tabs using the `storage` event.

*   **📐 Logic Extraction & Testing**
    *   The core business logic for toggling an item and recalculating the score has been extracted into a pure function `togglePracticeItem`.
    *   Added unit tests for this function (`wisdom-garden.test.ts`) to ensure its correctness and prevent regressions.

*   **♻️ Component Enhancements**
    *   `PracticeChecklist` and `PracticeCard` components were updated to accept a `readOnly` prop, making them reusable for both the read-only dashboard and the interactive practices page.

*   **CI/CD**
    *   Added a new GitHub Actions workflow to automatically deploy preview environments on Vercel for every pull request.

### How to Test

1.  Navigate to the **Dashboard** (`/`).
2.  Observe that the checklist is displayed, but you cannot check or uncheck items.
3.  Click on any checklist item. A toast message should appear at the bottom, saying "Please go to 'Practice Room' to check-in."
4.  Click the **"Go to Practice Room"** button.
5.  You should be on the `/weekly-practices` page. Here, you can check and uncheck items freely.
6.  Go back to the Dashboard. The summary view should now reflect the changes you just made.
7.  Refresh the page. Your progress should be persisted.
8.  Use the week selector at the top to switch between weeks and confirm the correct data is loaded on both pages.