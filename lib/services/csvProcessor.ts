import { WeeklyContent, CsvProcessResult, CsvValidationError } from '../types/content';
import { CONTENT_CATEGORIES, ContentCategory } from '../constants/categories';

/**
 * Validates and processes a CSV string into WeeklyContent objects.
 * 
 * @param csvContent The raw CSV content as a string.
 * @returns A promise resolving to a CsvProcessResult object.
 */
export async function parseAndValidateCsv(csvContent: string): Promise<CsvProcessResult> {
    const errors: CsvValidationError[] = [];
    const validData: WeeklyContent[] = [];

    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length === 0) {
        errors.push({ row: 0, message: 'File is empty' });
        return { success: false, errors };
    }

    // Header Validation (FR2)
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['week', 'category', 'title', 'content'];

    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
    if (missingHeaders.length > 0) {
        errors.push({ row: 1, message: `Missing required headers: ${missingHeaders.join(', ')}` });
        return { success: false, errors };
    }

    // Row Index Mapping
    const idxWeek = headers.indexOf('week');
    const idxCategory = headers.indexOf('category');
    const idxTitle = headers.indexOf('title');
    const idxContent = headers.indexOf('content');

    // Process Rows (FR3)
    for (let i = 1; i < lines.length; i++) {
        const row = parseCsvLine(lines[i]); // Custom parser needed for quotes
        if (row.length < requiredHeaders.length) {
            // Skip empty lines if parser returns empty, but we filtered earlier.
            // Still, check length.
            if (row.length === 1 && row[0] === '') continue;
            errors.push({ row: i + 1, message: 'Invalid number of columns' });
            continue;
        }

        const weekVal = parseInt(row[idxWeek], 10);
        const categoryVal = row[idxCategory].trim();
        const titleVal = row[idxTitle].trim();
        const contentVal = row[idxContent].trim();

        const initialErrorCount = errors.length;

        // Field Validation
        if (isNaN(weekVal) || weekVal < 1 || weekVal > 8) {
            errors.push({ row: i + 1, message: `Week must be between 1 and 8. Got: ${weekVal}` });
        }

        if (!CONTENT_CATEGORIES.includes(categoryVal as ContentCategory)) {
            errors.push({ row: i + 1, message: `Invalid category: '${categoryVal}'. Must be one of the predefined 11 categories.` });
        }

        if (!titleVal) {
            errors.push({ row: i + 1, message: 'Title cannot be empty.' });
        }

        // Create Valid Object if no NEW errors for this row
        if (errors.length === initialErrorCount) {
            validData.push({
                id: `week-${weekVal}-${categoryVal.toLowerCase().replace(/\s+/g, '-')}`,
                week: weekVal,
                category: categoryVal as ContentCategory,
                title: titleVal,
                content: contentVal,
                lastUpdated: new Date().toISOString()
            });
        }
    }

    // Atomic Check (FR4): If any errors exist, return only errors.
    if (errors.length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: validData };
}

// Simple CSV Parser to handle quoted strings (e.g. "Title, with comma")
function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    // Remove surrounding quotes if present
    return result.map(val => {
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            return val.substring(1, val.length - 1).replace(/""/g, '"'); // Handle escaped quotes if any
        }
        return val;
    });
}
