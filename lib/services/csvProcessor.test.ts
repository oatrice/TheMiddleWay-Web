import { describe, it, expect } from 'vitest';
import { parseAndValidateCsv } from './csvProcessor';

// Mock implementation of parseAndValidateCsv for now OR test fails without it
// But since we are creating the test file first, we import from a file that doesn't exist yet?
// Wait, create the dummy file first so import doesn't fail TS compile?
// Or create the test assuming the file exists (Red phase).

const validCsv = `Week,Category,Title,Content
1,Fitness,"Stretch Morning","Doing simple stretches"
2,Nutrition,"Drink Water","Hydration is key"`;

const invalidWeekCsv = `Week,Category,Title,Content
9,Fitness,"Stretch Morning","Doing simple stretches"`;

const invalidCategoryCsv = `Week,Category,Title,Content
1,Gym,"Stretch Morning","Doing simple stretches"`;

describe('CSV Processor', () => {
    it('should parse valid CSV correctly', async () => {
        // We need to Mock File object or pass string content directly?
        // Let's design the function to accept string content to make testing easier, 
        // and have a wrapper for File object.

        const result = await parseAndValidateCsv(validCsv);

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(2);
        expect(result.data?.[0]).toMatchObject({
            week: 1,
            category: 'Fitness',
            title: 'Stretch Morning',
            content: 'Doing simple stretches'
        });
    });

    it('should return error for invalid week number', async () => {
        const result = await parseAndValidateCsv(invalidWeekCsv);
        expect(result.success).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toContain('Week must be between 1 and 8');
    });

    it('should return error for invalid category', async () => {
        const result = await parseAndValidateCsv(invalidCategoryCsv);
        expect(result.success).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors?.[0].message).toContain('Invalid category');
    });
});
