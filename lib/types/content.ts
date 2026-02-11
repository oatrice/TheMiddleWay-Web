import { ContentCategory } from '../constants/categories';

export interface WeeklyContent {
    id: string; // Unique ID composed of week and category (e.g., "week-1-Mindfulness")
    week: number;
    category: ContentCategory;
    title: string;
    content: string;
    lastUpdated: string; // ISO Date string
}

export interface CsvValidationError {
    row: number;
    message: string;
}

export interface CsvProcessResult {
    success: boolean;
    data?: WeeklyContent[];
    errors?: CsvValidationError[];
}
