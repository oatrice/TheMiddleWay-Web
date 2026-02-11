Closes: [Link to Issue #5]

### Summary

This pull request introduces a comprehensive system for ingesting weekly content via CSV file uploads. It resolves the need for a scalable method to manage the 8-week content plan across 11 distinct categories.

The implementation includes a new **Admin Content Management UI**, seamless integration with a **Go backend API** for robust processing, and significant **CI/CD enhancements** for automated versioning and deployments. The core CSV parsing and validation logic was intentionally migrated from the frontend to the backend to improve performance, security, and maintain a clear separation of concerns.

### Key Changes & Implementation Details

1.  **Admin Content Management UI (`/admin/content`)**
    *   A new page has been created to serve as the central hub for content management.
    *   A user-friendly `CsvUploadForm` component provides a clear interface for file selection and displays real-time feedback.
    *   The UI includes explicit instructions on the required CSV format:
        *   **Headers:** `Week, Category, Title, Content`
        *   **Week:** A number from 1 to 8.
        *   **Category:** Must be an exact, case-sensitive match to one of the 11 predefined categories.

2.  **Backend Integration & Logic Migration**
    *   The primary responsibility for parsing, validating, and storing CSV data has been delegated to a dedicated Go backend service.
    *   A new frontend service, `contentService.ts`, handles the file upload by sending a `POST` request to the `/api/v1/content/upload` endpoint.
    *   This service is responsible for interpreting the API's JSON response, displaying either a success message with the count of ingested items or a detailed list of validation errors.

3.  **Data Validation & Constants**
    *   The backend now enforces strict validation rules for each row in the CSV, ensuring data integrity.
    *   A new constant file, `lib/constants/categories.ts`, was added to the frontend to define the 11 valid content categories, ensuring consistency.

4.  **CI/CD Enhancements**
    *   **Auto-Tag Workflow (`auto-tag.yml`):** Automatically creates and pushes a new Git tag whenever the `version` field in `package.json` is updated, streamlining the release process.
    *   **Vercel Version Alias (`vercel-version-alias.yml`):** Creates a unique, immutable Vercel deployment URL based on the Git tag (e.g., `my-app-v1-2-3.vercel.app`). This provides stable links for testing and reviewing specific versions.

5.  **Testing & Code Quality**
    *   Unit tests have been added for the new `contentService` to verify its interaction with the backend API, including success and error handling.
    *   The implementation incorporates feedback from a code review, leading to improved logic and script reliability.

### How to Test

1.  Navigate to the new admin page at `/admin/content`.
2.  **Test the Happy Path:**
    *   Create a CSV file with valid data (e.g., `Week` between 1-8, `Category` from the approved list).
    *   Click "Select CSV File" and upload it.
    *   **Expected:** A success message appears, indicating the number of content items processed by the backend.
3.  **Test Validation Errors:**
    *   Create a CSV file with invalid data (e.g., a row with `Week: 9`, another with `Category: Health`, a missing `Title` header).
    *   Upload the invalid file.
    *   **Expected:** A validation error message appears, listing each error with its corresponding row number and a descriptive message (e.g., "Row 2: Week must be between 1 and 8").
4.  Verify the network request in your browser's developer tools to see the `POST` request to the backend and the JSON response.