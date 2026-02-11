export const CONTENT_CATEGORIES = [
    'Mindfulness',
    'Nutrition',
    'Fitness',
    'Sleep',
    'Stress Management',
    'Productivity',
    'Relationships',
    'Financial Wellness',
    'Creativity',
    'Environment',
    'Community',
] as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[number];
