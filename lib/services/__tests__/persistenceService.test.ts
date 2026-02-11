import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    saveProgress,
    loadProgress,
    clearProgress,
} from "../persistenceService";
import { UserProgress, STORAGE_KEY } from "../../types/progress";

// ===================================================================
// 🟥 RED Phase: Failing Tests
// ทดสอบ PersistenceService ทั้ง 3 methods: save, load, clear
// ===================================================================

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
        _getStore: () => store,
    };
})();

Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
});

describe("PersistenceService", () => {
    const sampleProgress: UserProgress = {
        version: 1,
        themeMode: "dark",
        language: "th",
        completedLessons: ["lesson-1-four-noble-truths"],
        bookmarks: ["lesson-2-eightfold-path"],
        lastVisited: "2026-02-10T18:00:00Z",
    };

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    // ─── saveProgress ────────────────────────────────────

    describe("saveProgress", () => {
        it("ควร serialize และเก็บลง localStorage ด้วย key ที่ถูกต้อง", () => {
            const result = saveProgress(sampleProgress);

            expect(result).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                JSON.stringify(sampleProgress)
            );
        });

        it("ควร return false เมื่อ localStorage ไม่พร้อมใช้งาน (quota exceeded)", () => {
            vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
                throw new DOMException("QuotaExceededError");
            });

            const result = saveProgress(sampleProgress);
            expect(result).toBe(false);
        });
    });

    // ─── loadProgress ────────────────────────────────────

    describe("loadProgress", () => {
        it("ควร return parsed object เมื่อมี valid data ใน localStorage", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProgress));

            const result = loadProgress();
            expect(result).toEqual(sampleProgress);
        });

        it("ควร return null เมื่อไม่มี data ใน localStorage", () => {
            const result = loadProgress();
            expect(result).toBeNull();
        });

        it("ควร return null เมื่อ data เป็น malformed JSON", () => {
            localStorage.setItem(STORAGE_KEY, "{'invalid': 'json'}");

            const result = loadProgress();
            expect(result).toBeNull();
        });

        it("ควร return null เมื่อ data เป็น string ธรรมดา", () => {
            localStorage.setItem(STORAGE_KEY, "just a string");

            const result = loadProgress();
            expect(result).toBeNull();
        });

        it("ควร return null เมื่อ data ไม่มี version field (invalid schema)", () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ unexpectedKey: true })
            );

            const result = loadProgress();
            expect(result).toBeNull();
        });
    });

    // ─── clearProgress ───────────────────────────────────

    describe("clearProgress", () => {
        it("ควรลบ data ออกจาก localStorage", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProgress));

            const result = clearProgress();

            expect(result).toBe(true);
            expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
        });

        it("ควร return true แม้ไม่มี data อยู่เลย", () => {
            const result = clearProgress();
            expect(result).toBe(true);
        });

        it("ควร return false เมื่อ localStorage throw error", () => {
            vi.spyOn(localStorage, "removeItem").mockImplementationOnce(() => {
                throw new Error("Storage error");
            });

            const result = clearProgress();
            expect(result).toBe(false);
        });
    });
});
