import { WeeklyContent, CsvValidationError } from '../types/content';

export const CONTENT_STORAGE_KEY = 'mdw_weekly_content';
// Use env var or default to localhost:8080
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ContentStorageSchema {
    version: number;
    items: Record<string, WeeklyContent>; // Keyed by ID for O(1) upsert
}

export interface UploadResponse {
    status: string;
    message: string;
    count?: number;
    errors?: CsvValidationError[];
}

const CURRENT_VERSION = 1;

/**
 * Uploads a CSV file to the backend for processing and storage.
 */
export async function uploadContentCsv(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/content/upload`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle validation errors from backend
            return {
                status: 'error',
                message: result.message || 'Upload failed',
                errors: result.errors || [{ row: 0, message: result.message || 'Unknown error' }]
            };
        }

        return result;
    } catch (error) {
        console.error('Network request failed:', error);
        return {
            status: 'error',
            message: 'Network error. Please check if the backend server is running.',
            errors: [{ row: 0, message: 'Could not connect to backend server.' }]
        };
    }
}

/**
 * Loads all content from LocalStorage (Deprecated for production, kept for fallback/dev).
 * Returns an empty object structure if nothing exists or error occurs.
 */
export function getAllContent(): WeeklyContent[] {
    try {
        const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || !parsed.items) {
            return [];
        }

        return Object.values(parsed.items);
    } catch (error) {
        console.warn('[ContentService] Failed to load content:', error);
        return [];
    }
}

/**
 * Upserts a list of WeeklyContent items into LocalStorage.
 * Preserves existing items that are not in the new list.
 * Updates items that have matching IDs.
 */
export function saveContent(newItems: WeeklyContent[]): boolean {
    try {
        // 1. Load existing
        const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
        let storage: ContentStorageSchema = {
            version: CURRENT_VERSION,
            items: {}
        };

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.items) {
                    storage = parsed;
                }
            } catch {
                // Ignore corrupt data, start fresh
                console.warn('[ContentService] Corrupt data found, starting fresh integration.');
            }
        }

        // 2. Upsert logic
        newItems.forEach(item => {
            storage.items[item.id] = item;
        });

        // 3. Save back
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(storage));
        return true;
    } catch (error) {
        console.error('[ContentService] Failed to save content:', error);
        return false;
    }
}

/**
 * Clears all content (Development utility)
 */
export function clearAllContent(): void {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
}
