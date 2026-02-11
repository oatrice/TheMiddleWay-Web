import { WeeklyData } from "@/lib/types/wisdom-garden";

export const WEEKLY_MOCK_DATA: WeeklyData[] = Array.from({ length: 8 }, (_, i) => ({
    weekNumber: i + 1,
    currentScore: 0,
    maxScore: 70, // Assuming 10 points per day? Or 70 total?
    categories: [
        {
            id: "giving",
            title: "Giving (ทาน)",
            items: [
                { id: "g1", title: "Offering alms to monks", points: 5, isCompleted: false },
                { id: "g2", title: "Donating to charity", points: 5, isCompleted: false },
            ],
        },
        {
            id: "ethics",
            title: "Ethics (ศีล)",
            items: [
                { id: "e1", title: "Abstaining from killing", points: 5, isCompleted: false },
                { id: "e2", title: "Abstaining from stealing", points: 5, isCompleted: false },
            ],
        },
        {
            id: "meditation",
            title: "Meditation (ภาวนา)",
            items: [
                { id: "m1", title: "Morning Meditation (15 mins)", points: 10, isCompleted: false },
                { id: "m2", title: "Evening Meditation (15 mins)", points: 10, isCompleted: false },
            ],
        },
    ],
}));
