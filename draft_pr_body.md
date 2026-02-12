Closes: https://github.com/owner/repo/issues/11

### Summary

This pull request introduces a multi-step onboarding experience for first-time users. The goal is to provide a warm welcome, introduce the app's core philosophy of "Authentic Wisdom," and set expectations for the user's journey. This flow is designed to be engaging and informative, ensuring new users understand the value proposition from their very first visit.

The onboarding state is managed via `localStorage`, so returning users will bypass this flow and go directly to the main application.

### Key Changes

-   **✨ Multi-Step Onboarding Flow:**
    -   A new `OnboardingScreen.tsx` component has been created, which presents a four-step animated carousel to the user.
    -   The flow covers:
        1.  A general welcome.
        2.  An introduction to "Authentic Wisdom."
        3.  The concept of "Discover Your Path."
        4.  The importance of a "Daily Practice."
    -   Animations are handled by `framer-motion` for a smooth and polished user experience.
    -   New image assets have been added for each onboarding step.

-   **⚙️ `useOnboarding` Custom Hook:**
    -   A new hook, `useOnboarding.ts`, has been implemented to manage the onboarding state.
    -   It checks `localStorage` for a completion flag (`onboarding_completed`) to determine if the user has seen the flow before.
    -   It includes an `isLoading` state to prevent a flash of the main content before the check is complete.
    -   Provides `completeOnboarding` and `resetOnboarding` functions for managing the state.

-   **🏠 Integration with Main Page:**
    -   The main `app/page.tsx` now utilizes the `useOnboarding` hook to conditionally render the `OnboardingScreen` for new users. Once completed, the main `WisdomGardenScreen` is displayed.

-   **🧪 Comprehensive Testing:**
    -   Added unit tests for the `OnboardingScreen` component in `OnboardingScreen.test.tsx`.
    -   Tests cover initial rendering, navigation between slides, the "Skip" functionality, and the final completion step.

-   **🐛 Bug Fix: Toast Notification Timer:**
    -   As a minor improvement, the logic for the toast notification timer on the main page was moved into a `useEffect` hook. This ensures the timer is properly cleaned up when the component unmounts, preventing potential memory leaks.

### How to Test

1.  Pull down the branch and run the application (`npm run dev`).
2.  Open your browser's developer tools.
3.  Navigate to the **Application** tab -> **Local Storage** and clear any existing data for `localhost:3000`.
4.  Refresh the page. You should see the new multi-step onboarding flow.
5.  Click **"Get Started"** and **"Next"** to navigate through all the slides.
6.  On the final slide, click **"Begin Your Journey"**. You should be redirected to the main application.
7.  Refresh the page again. The onboarding screen should **not** appear, and you should see the main application directly.
8.  To re-test the "skip" functionality, clear local storage again and click the **"Skip"** button on one of the initial slides. You should be taken directly to the main application.

### Screenshot