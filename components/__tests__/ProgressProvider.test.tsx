import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { ProgressProvider, useProgress } from "../ProgressProvider";

// ===================================================================
// 🟥 RED Phase: Failing Tests สำหรับ ProgressProvider
// ทดสอบการ integrate PersistenceService กับ React Context
// ===================================================================

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete store[key];
    }),
    clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
    }),
    get length() {
        return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
};

Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
});

function wrapper({ children }: { children: ReactNode }) {
    return <ProgressProvider>{children}</ProgressProvider>;
}

describe("ProgressProvider + useProgress", () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    // ─── Initialization ──────────────────────────────────

    it("ควรให้ค่า default เมื่อไม่มี saved data", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        expect(result.current.progress.version).toBe(1);
        expect(result.current.progress.themeMode).toBe("light");
        expect(result.current.progress.language).toBe("th");
        expect(result.current.progress.completedLessons).toEqual([]);
        expect(result.current.progress.bookmarks).toEqual([]);
    });

    it("ควรโหลด saved data จาก localStorage ตอน mount", () => {
        const saved = {
            version: 1,
            themeMode: "dark" as const,
            language: "en" as const,
            completedLessons: ["lesson-1"],
            bookmarks: [],
            lastVisited: "2026-02-10T18:00:00Z",
        };
        localStorageMock.setItem("theMiddleWay.progress", JSON.stringify(saved));

        const { result } = renderHook(() => useProgress(), { wrapper });

        expect(result.current.progress.themeMode).toBe("dark");
        expect(result.current.progress.language).toBe("en");
        expect(result.current.progress.completedLessons).toEqual(["lesson-1"]);
    });

    // ─── Lesson Completion ───────────────────────────────

    it("ควร mark lesson ว่า completed ได้", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.completeLesson("lesson-2-eightfold-path");
        });

        expect(result.current.progress.completedLessons).toContain(
            "lesson-2-eightfold-path"
        );
    });

    it("ไม่ควร duplicate lesson ที่ completed แล้ว", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.completeLesson("lesson-1");
            result.current.completeLesson("lesson-1");
        });

        expect(
            result.current.progress.completedLessons.filter((l) => l === "lesson-1")
                .length
        ).toBe(1);
    });

    // ─── Bookmarks ───────────────────────────────────────

    it("ควร toggle bookmark ได้ (เพิ่ม)", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.toggleBookmark("lesson-3");
        });

        expect(result.current.progress.bookmarks).toContain("lesson-3");
    });

    it("ควร toggle bookmark ได้ (ลบ)", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.toggleBookmark("lesson-3");
        });
        act(() => {
            result.current.toggleBookmark("lesson-3");
        });

        expect(result.current.progress.bookmarks).not.toContain("lesson-3");
    });

    // ─── Theme ───────────────────────────────────────────

    it("ควร update themeMode ได้", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.setThemeMode("dark");
        });

        expect(result.current.progress.themeMode).toBe("dark");
    });

    // ─── Language ────────────────────────────────────────

    it("ควร update language ได้", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.setLanguage("en");
        });

        expect(result.current.progress.language).toBe("en");
    });

    // ─── Reset ───────────────────────────────────────────

    it("ควร reset progress กลับเป็น default ได้", () => {
        const { result } = renderHook(() => useProgress(), { wrapper });

        act(() => {
            result.current.completeLesson("lesson-1");
            result.current.setThemeMode("dark");
        });
        act(() => {
            result.current.resetProgress();
        });

        expect(result.current.progress.themeMode).toBe("light");
        expect(result.current.progress.completedLessons).toEqual([]);
    });

    // ─── Auto-save ───────────────────────────────────────

    it("ควร auto-save ลง localStorage เมื่อ progress เปลี่ยน", () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useProgress(), { wrapper });

        // flush setTimeout(0) ภายใน ProgressProvider ที่ปิด isInitialMount flag
        act(() => {
            vi.advanceTimersByTime(1);
        });

        vi.clearAllMocks(); // เคลียร์ calls จาก initial load

        act(() => {
            result.current.completeLesson("lesson-1");
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            "theMiddleWay.progress",
            expect.stringContaining("lesson-1")
        );

        vi.useRealTimers();
    });

    // ─── Error: useProgress outside Provider ─────────────

    it("ควร throw error ถ้าเรียก useProgress นอก Provider", () => {
        expect(() => {
            renderHook(() => useProgress());
        }).toThrow("useProgress must be used within a ProgressProvider");
    });
});
