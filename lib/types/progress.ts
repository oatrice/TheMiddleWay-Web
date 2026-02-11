/**
 * UserProgress — โครงสร้างข้อมูลสำหรับเก็บความคืบหน้าของผู้ใช้
 * ใช้ versioned schema เพื่อรองรับ data migration ในอนาคต
 */
export interface UserProgress {
    version: number;
    themeMode: "light" | "dark";
    language: "th" | "en";
    completedLessons: string[];
    bookmarks: string[];
    lastVisited: string; // ISO 8601 datetime
}

/** ค่าเริ่มต้นสำหรับผู้ใช้ใหม่ */
export const DEFAULT_PROGRESS: UserProgress = {
    version: 1,
    themeMode: "light",
    language: "th",
    completedLessons: [],
    bookmarks: [],
    lastVisited: "",
};

/** Storage key สำหรับ localStorage */
export const STORAGE_KEY = "theMiddleWay.progress";
