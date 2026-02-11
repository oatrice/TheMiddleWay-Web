# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Data] CSV Data Ingestion & Logic: Mapping 11 Categories and 8-Week Content
ISSUE: {
  "title": "[Data] CSV Data Ingestion & Logic: Mapping 11 Categories and 8-Week Content",
  "number": 5
}

GIT CONTEXT:
COMMITS:
a137844 feat(admin): add CSV content upload, backend integration, and CI/CD
045028d docs: update code review report with CSV processor and workflow findings
ae7c819 refactor: apply code review feedback (csv logic, ci script)
63d12c6 feat: integrate Go backend API for content upload #5
4330637 refactor(admin): migrate CSV processing to Go backend
4fb3718 feat(admin): add content management page with CSV upload
cccc0ab chore: add .env*.local to .gitignore
a3950ec ci: add Vercel version alias workflow for tag-based URLs
77eede4 ci: add auto-tag workflow on version change

STATS:
.github/workflows/auto-tag.yml             |  48 +++++++++++
 .github/workflows/vercel-version-alias.yml |  68 +++++++++++++++
 .gitignore                                 |   1 +
 CHANGELOG.md                               |   8 ++
 README.md                                  |   3 +-
 app/admin/content/page.tsx                 |  64 ++++++++++++++
 code_review.md                             | 133 +++++++++++++----------------
 components/admin/CsvUploadForm.tsx         | 112 ++++++++++++++++++++++++
 lib/constants/categories.ts                |  15 ++++
 lib/services/contentService.test.ts        |  58 +++++++++++++
 lib/services/contentService.ts             | 122 ++++++++++++++++++++++++++
 lib/services/csvProcessor.test.ts          |  50 +++++++++++
 lib/services/csvProcessor.ts               | 116 +++++++++++++++++++++++++
 lib/types/content.ts                       |  21 +++++
 package.json                               |   2 +-
 15 files changed, 745 insertions(+), 76 deletions(-)

KEY FILE DIFFS:
diff --git a/app/admin/content/page.tsx b/app/admin/content/page.tsx
new file mode 100644
index 0000000..aa21104
--- /dev/null
+++ b/app/admin/content/page.tsx
@@ -0,0 +1,64 @@
+'use client';
+
+import React from 'react';
+import CsvUploadForm from '@/components/admin/CsvUploadForm';
+import { useThemeContext as useTheme } from '@/components/ThemeProvider';
+import { Upload } from 'lucide-react';
+
+export default function ContentAdminPage() {
+    const { theme } = useTheme();
+
+    return (
+        <div className={`
+      min-h-screen pt-safe pb-safe
+      ${theme === 'dark' ? 'bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}
+      transition-colors duration-300
+    `}>
+            <header className="px-6 py-6 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10 w-full flex items-center justify-between">
+                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
+            </header>
+
+            <main className="container max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
+                <section className="space-y-4">
+                    <div className="flex items-center gap-3">
+                        <div className="p-2 bg-primary/10 rounded-lg">
+                            <Upload className="w-6 h-6 text-primary" />
+                        </div>
+                        <div>
+                            <h2 className="text-xl font-semibold">Content Ingestion</h2>
+                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and upload weekly content via CSV.</p>
+                        </div>
+                    </div>
+
+                    {/* Form Area using standard HTML instead of shadcn Card */}
+                    <div className="mt-8 bg-card rounded-xl border border-border shadow-sm p-6 bg-white dark:bg-slate-800">
+                        <CsvUploadForm />
+                    </div>
+                </section>
+
+                {/* Instructions */}
+                <section className="mt-12 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-border/50">
+                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">CSV Requirements</h3>
+                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
+                        <li className="flex items-start gap-2">
+                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
+                            <span>Headers: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Week, Category, Title, Content</code></span>
+                        </li>
+                        <li className="flex items-start gap-2">
+                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
+                            <span>Week: Number 1-8</span>
+                        </li>
+                        <li className="flex items-start gap-2">
+                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
+                            <span>Category: Exact match (Case sensitive)</span>
+                        </li>
+                        <li className="flex items-start gap-2">
+                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
+                            <span>UTF-8 Encoding (Recommended)</span>
+                        </li>
+                    </ul>
+                </section>
+            </main>
+        </div>
+    );
+}
diff --git a/components/admin/CsvUploadForm.tsx b/components/admin/CsvUploadForm.tsx
new file mode 100644
index 0000000..4033216
--- /dev/null
+++ b/components/admin/CsvUploadForm.tsx
@@ -0,0 +1,112 @@
+'use client';
+
+import { useState } from 'react';
+import { uploadContentCsv, UploadResponse } from '@/lib/services/contentService';
+import { CsvValidationError } from '@/lib/types/content';
+import { Loader2, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
+
+export default function CsvUploadForm() {
+    const [isProcessing, setIsProcessing] = useState(false);
+    const [errors, setErrors] = useState<CsvValidationError[] | null>(null);
+    const [successCount, setSuccessCount] = useState<number | null>(null);
+    const [errorMessage, setErrorMessage] = useState<string | null>(null);
+
+    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
+        const file = e.target.files?.[0];
+        if (!file) return;
+
+        // Reset state
+        setIsProcessing(true);
+        setErrors(null);
+        setSuccessCount(null);
+        setErrorMessage(null);
+
+        try {
+            const result: UploadResponse = await uploadContentCsv(file);
+
+            if (result.status === 'success') {
+                setSuccessCount(result.count || 0);
+                e.target.value = ''; // Reset file input
+            } else {
+                setErrors(result.errors || []);
+                setErrorMessage(result.message);
+            }
+        } catch (err) {
+            console.error('Upload error:', err);
+            setErrorMessage('Unexpected error processing file.');
+        } finally {
+            setIsProcessing(false);
+        }
+    };
+
+    return (
+        <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
+            <div className="text-center">
+                <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
+                <h2 className="text-xl font-semibold text-gray-900">Upload Content CSV</h2>
+                <p className="text-sm text-gray-500 mt-2">
+                    Select a .csv file containing standard weekly content columns.
+                    <br />
+                    <span className="text-xs text-blue-500">Processed by Go Backend</span>
+                </p>
+            </div>
+
+            <div className="flex justify-center">
+                <label className="relative cursor-pointer bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
+                    {isProcessing ? (
+                        <>
+                            <Loader2 className="animate-spin w-5 h-5" />
+                            <span>Uploading & Processing...</span>
+                        </>
+                    ) : (
+                        <>
+                            <span>Select CSV File</span>
+                            <input
+                                type="file"
+                                accept=".csv"
+                                onChange={handleFileChange}
+                                disabled={isProcessing}
+                                className="hidden"
+                            />
+                        </>
+                    )}
+                </label>
+            </div>
+
+            {/* Success State */}
+            {successCount !== null && (
+                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
+                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
+                    <div>
+                        <h3 className="font-medium text-green-900">Import Successful!</h3>
+                        <p className="text-sm text-green-700 mt-1">
+                            Backend processed and saved <strong>{successCount}</strong> content items.
+                        </p>
+                    </div>
+                </div>
+            )}
+
+            {/* Error State */}
+            {(errorMessage || (errors && errors.length > 0)) && (
+                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
+                    <div className="flex items-center gap-2 mb-3">
+                        <AlertCircle className="w-5 h-5 text-red-600" />
+                        <h3 className="font-medium text-red-900">Validation Failed</h3>
+                    </div>
+
+                    {errorMessage && <p className="text-sm text-red-700 mb-2">{errorMessage}</p>}
+
+                    {errors && errors.length > 0 && (
+                        <ul className="space-y-2 text-sm text-red-700 list-disc list-inside bg-white/50 p-3 rounded border border-red-100 max-h-60 overflow-y-auto">
+                            {errors.map((err, idx) => (
+                                <li key={idx}>
+                                    <span className="font-semibold">Row {err.row}:</span> {err.message}
+                                </li>
+                            ))}
+                        </ul>
+                    )}
+                </div>
+            )}
+        </div>
+    );
+}
diff --git a/lib/constants/categories.ts b/lib/constants/categories.ts
new file mode 100644
index 0000000..3598799
--- /dev/null
+++ b/lib/constants/categories.ts
@@ -0,0 +1,15 @@
+export const CONTENT_CATEGORIES = [
+    'Mindfulness',
+    'Nutrition',
+    'Fitness',
+    'Sleep',
+    'Stress Management',
+    'Productivity',
+    'Relationships',
+    'Financial Wellness',
+    'Creativity',
+    'Environment',
+    'Community',
+] as const;
+
+export type ContentCategory = typeof CONTENT_CATEGORIES[number];
diff --git a/lib/services/contentService.test.ts b/lib/services/contentService.test.ts
new file mode 100644
index 0000000..85567a0
--- /dev/null
+++ b/lib/services/contentService.test.ts
@@ -0,0 +1,58 @@
+import { describe, it, expect, vi, beforeEach } from 'vitest';
+import { uploadContentCsv, API_BASE_URL } from './contentService';
+
+describe('contentService', () => {
+    describe('uploadContentCsv', () => {
+        let fetchMock: any;
+
+        beforeEach(() => {
+            fetchMock = vi.fn();
+            global.fetch = fetchMock;
+        });
+
+        it('should return success response when upload succeeds', async () => {
+            fetchMock.mockResolvedValueOnce({
+                ok: true,
+                json: async () => ({ status: 'success', message: 'OK', count: 5 }),
+            });
+
+            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
+            const result = await uploadContentCsv(file);
+
+            expect(result).toEqual({ status: 'success', message: 'OK', count: 5 });
+            expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/content/upload`, expect.objectContaining({
+                method: 'POST',
+                body: expect.any(FormData),
+            }));
+        });
+
+        it('should return error response when backend returns failure', async () => {
+            fetchMock.mockResolvedValueOnce({
+                ok: false,
+                json: async () => ({ status: 'error', message: 'Failed', errors: [{ row: 1, message: 'Bad' }] }),
+            });
+
+            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
+            const result = await uploadContentCsv(file);
+
+            expect(result).toEqual({
+                status: 'error',
+                message: 'Failed',
+                errors: [{ row: 1, message: 'Bad' }],
+            });
+        });
+
+        it('should handle network errors gracefully', async () => {
+            fetchMock.mockRejectedValueOnce(new Error('Network Error'));
+
+            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
+            const result = await uploadContentCsv(file);
+
+            expect(result).toEqual({
+                status: 'error',
+                message: expect.stringContaining('Network error'),
+                errors: [{ row: 0, message: expect.stringContaining('Could not connect') }],
+            });
+        });
+    });
+});
diff --git a/lib/services/contentService.ts b/lib/services/contentService.ts
new file mode 100644
index 0000000..1a68f53
--- /dev/null
+++ b/lib/services/contentService.ts
@@ -0,0 +1,122 @@
+import { WeeklyContent, CsvValidationError } from '../types/content';
+
+export const CONTENT_STORAGE_KEY = 'mdw_weekly_content';
+// Use env var or default to localhost:8080
+export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
+
+export interface ContentStorageSchema {
+    version: number;
+    items: Record<string, WeeklyContent>; // Keyed by ID for O(1) upsert
+}
+
+export interface UploadResponse {
+    status: string;
+    message: string;
+    count?: number;
+    errors?: CsvValidationError[];
+}
+
+const CURRENT_VERSION = 1;
+
+/**
+ * Uploads a CSV file to the backend for processing and storage.
+ */
+export async function uploadContentCsv(file: File): Promise<UploadResponse> {
+    const formData = new FormData();
+    formData.append('file', file);
+
+    try {
+        const response = await fetch(`${API_BASE_URL}/content/upload`, {
+            method: 'POST',
+            body: formData,
+        });
+
+        const result = await response.json();
+
+        if (!response.ok) {
+            // Handle validation errors from backend
+            return {
+                status: 'error',
+                message: result.message || 'Upload failed',
+                errors: result.errors || [{ row: 0, message: result.message || 'Unknown error' }]
+            };
+        }
+
+        return result;
+    } catch (error) {
+        console.error('Network request failed:', error);
+        return {
+            status: 'error',
+            message: 'Network error. Please check if the backend server is running.',
+            errors: [{ row: 0, message: 'Could not connect to backend server.' }]
+        };
+    }
+}
+
+/**
+ * Loads all content from LocalStorage (Deprecated for production, kept for fallback/dev).
+ * Returns an empty object structure if nothing exists or error occurs.
+ */
+export function getAllContent(): WeeklyContent[] {
+    try {
+        const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
+        if (!raw) return [];
+
+        const parsed = JSON.parse(raw);
+        if (!parsed || typeof parsed !== 'object' || !parsed.items) {
+            return [];
+        }
+
+        return Object.values(parsed.items);
+    } catch (error) {
+        console.warn('[ContentService] Failed to load content:', error);
+        return [];
+    }
+}
+
+/**
+ * Upserts a list of WeeklyContent items into LocalStorage.
+ * Preserves existing items that are not in the new list.
+ * Updates items that have matching IDs.
+ */
+export function saveContent(newItems: WeeklyContent[]): boolean {
+    try {
+        // 1. Load existing
+        const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
+        let storage: ContentStorageSchema = {
+            version: CURRENT_VERSION,
+            items: {}
+        };
+
+        if (raw) {
+            try {
+                const parsed = JSON.parse(raw);
+                if (parsed && parsed.items) {
+                    storage = parsed;
+                }
+            } catch {
+                // Ignore corrupt data, start fresh
+                console.warn('[ContentService] Corrupt data found, starting fresh integration.');
+            }
+        }
+
+        // 2. Upsert logic
+        newItems.forEach(item => {
+            storage.items[item.id] = item;
+        });
+
+        // 3. Save back
+        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(storage));
+        return true;
+    } catch (error) {
+        console.error('[ContentService] Failed to save content:', error);
+        return false;
+    }
+}
+
+/**
+ * Clears all content (Development utility)
+ */
+export function clearAllContent(): void {
+    localStorage.removeItem(CONTENT_STORAGE_KEY);
+}
diff --git a/lib/services/csvProcessor.test.ts b/lib/services/csvProcessor.test.ts
new file mode 100644
index 0000000..ad84e0b
--- /dev/null
+++ b/lib/services/csvProcessor.test.ts
@@ -0,0 +1,50 @@
+import { describe, it, expect } from 'vitest';
+import { parseAndValidateCsv } from './csvProcessor';
+
+// Mock implementation of parseAndValidateCsv for now OR test fails without it
+// But since we are creating the test file first, we import from a file that doesn't exist yet?
+// Wait, create the dummy file first so import doesn't fail TS compile?
+// Or create the test assuming the file exists (Red phase).
+
+const validCsv = `Week,Category,Title,Content
+1,Fitness,"Stretch Morning","Doing simple stretches"
+2,Nutrition,"Drink Water","Hydration is key"`;
+
+const invalidWeekCsv = `Week,Category,Title,Content
+9,Fitness,"Stretch Morning","Doing simple stretches"`;
+
+const invalidCategoryCsv = `Week,Category,Title,Content
+1,Gym,"Stretch Morning","Doing simple stretches"`;
+
+describe('CSV Processor', () => {
+    it('should parse valid CSV correctly', async () => {
+        // We need to Mock File object or pass string content directly?
+        // Let's design the function to accept string content to make testing easier, 
+        // and have a wrapper for File object.
+
+        const result = await parseAndValidateCsv(validCsv);
+
+        expect(result.success).toBe(true);
+        expect(result.data).toHaveLength(2);
+        expect(result.data?.[0]).toMatchObject({
+            week: 1,
+            category: 'Fitness',
+            title: 'Stretch Morning',
+            content: 'Doing simple stretches'
+        });
+    });
+
+    it('should return error for invalid week number', async () => {
+        const result = await parseAndValidateCsv(invalidWeekCsv);
+        expect(result.success).toBe(false);
+        expect(result.errors).toHaveLength(1);
+        expect(result.errors?.[0].message).toContain('Week must be between 1 and 8');
+    });
+
+    it('should return error for invalid category', async () => {
+        const result = await parseAndValidateCsv(invalidCategoryCsv);
+        expect(result.success).toBe(false);
+        expect(result.errors).toHaveLength(1);
+        expect(result.errors?.[0].message).toContain('Invalid category');
+    });
+});
diff --git a/lib/services/csvProcessor.ts b/lib/services/csvProcessor.ts
new file mode 100644
index 0000000..bbabc7a
--- /dev/null
+++ b/lib/services/csvProcessor.ts
@@ -0,0 +1,116 @@
+import { WeeklyContent, CsvProcessResult, CsvValidationError } from '../types/content';
+import { CONTENT_CATEGORIES, ContentCategory } from '../constants/categories';
+
+/**
+ * Validates and processes a CSV string into WeeklyContent objects.
+ * 
+ * @param csvContent The raw CSV content as a string.
+ * @returns A promise resolving to a CsvProcessResult object.
+ */
+export async function parseAndValidateCsv(csvContent: string): Promise<CsvProcessResult> {
+    const errors: CsvValidationError[] = [];
+    const validData: WeeklyContent[] = [];
+
+    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
+
+    if (lines.length === 0) {
+        errors.push({ row: 0, message: 'File is empty' });
+        return { success: false, errors };
+    }
+
+    // Header Validation (FR2)
+    const headerLine = lines[0];
+    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
+    const requiredHeaders = ['week', 'category', 'title', 'content'];
+
+    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
+    if (missingHeaders.length > 0) {
+        errors.push({ row: 1, message: `Missing required headers: ${missingHeaders.join(', ')}` });
+        return { success: false, errors };
+    }
+
+    // Row Index Mapping
+    con
... (Diff truncated for size) ...

PR TEMPLATE:


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
