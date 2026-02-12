export interface PracticeItem {
    id: string;
    title: string; // Simplified for now, removing TH/EN support object
    points: number;
    isCompleted: boolean;
}

export interface PracticeCategory {
    id: string;
    title: string;
    items: PracticeItem[];
}

export interface WeeklyData {
    weekNumber: number;
    categories: PracticeCategory[];
    currentScore: number;
    maxScore: number;
}
