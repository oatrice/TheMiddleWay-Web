/**
 * PersistenceService — จัดการการอ่าน/เขียนข้อมูลผู้ใช้ลง localStorage
 *
 * ออกแบบตาม spec.md:
 * - FR-1: Save progress ด้วย designated key
 * - FR-4: Load progress ตอน app start
 * - FR-7: Handle corrupt data ได้
 * - FR-8: Reset/clear progress ได้
 */

import { UserProgress, STORAGE_KEY } from "../types/progress";

/**
 * ตรวจสอบว่า object ที่ parse ได้เป็น UserProgress ที่ valid หรือไม่
 */
function isValidProgress(data: unknown): data is UserProgress {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as Record<string, unknown>;
    return (
        typeof obj.version === "number" &&
        (obj.themeMode === "light" || obj.themeMode === "dark") &&
        (obj.language === "th" || obj.language === "en") &&
        Array.isArray(obj.completedLessons) &&
        Array.isArray(obj.bookmarks)
    );
}

/**
 * บันทึกข้อมูลความคืบหน้าลง localStorage
 * @returns true ถ้าสำเร็จ, false ถ้าเกิด error
 */
export function saveProgress(progress: UserProgress): boolean {
    try {
        const serialized = JSON.stringify(progress);
        localStorage.setItem(STORAGE_KEY, serialized);
        return true;
    } catch (error) {
        console.warn("[PersistenceService] บันทึกข้อมูลไม่สำเร็จ:", error);
        return false;
    }
}

/**
 * โหลดข้อมูลความคืบหน้าจาก localStorage
 * @returns UserProgress ถ้ามี valid data, null ถ้าไม่มีหรือ data เสียหาย
 */
export function loadProgress(): UserProgress | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;

        const parsed: unknown = JSON.parse(raw);

        if (!isValidProgress(parsed)) {
            console.warn("[PersistenceService] ข้อมูลไม่ถูกต้อง — ใช้ค่าเริ่มต้นแทน");
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn("[PersistenceService] อ่านข้อมูลไม่สำเร็จ:", error);
        return null;
    }
}

/**
 * ลบข้อมูลความคืบหน้าทั้งหมดออกจาก localStorage
 * @returns true ถ้าสำเร็จ, false ถ้าเกิด error
 */
export function clearProgress(): boolean {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.warn("[PersistenceService] ลบข้อมูลไม่สำเร็จ:", error);
        return false;
    }
}
