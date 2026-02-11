"use client";

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import { UserProgress, DEFAULT_PROGRESS } from "@/lib/types/progress";
import { saveProgress, loadProgress, clearProgress } from "@/lib/services";

// ─── Context Type ──────────────────────────────────────

interface ProgressContextType {
    progress: UserProgress;
    completeLesson: (lessonId: string) => void;
    toggleBookmark: (lessonId: string) => void;
    setThemeMode: (mode: "light" | "dark") => void;
    setLanguage: (lang: "th" | "en") => void;
    resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
    undefined
);

// ─── Reducer ───────────────────────────────────────────

type ProgressAction =
    | { type: "LOAD"; payload: UserProgress }
    | { type: "COMPLETE_LESSON"; payload: string }
    | { type: "TOGGLE_BOOKMARK"; payload: string }
    | { type: "SET_THEME"; payload: "light" | "dark" }
    | { type: "SET_LANGUAGE"; payload: "th" | "en" }
    | { type: "RESET" };

function progressReducer(
    state: UserProgress,
    action: ProgressAction
): UserProgress {
    switch (action.type) {
        case "LOAD":
            return action.payload;

        case "COMPLETE_LESSON":
            // ไม่ให้ lesson ซ้ำ
            if (state.completedLessons.includes(action.payload)) return state;
            return {
                ...state,
                completedLessons: [...state.completedLessons, action.payload],
                lastVisited: new Date().toISOString(),
            };

        case "TOGGLE_BOOKMARK":
            return {
                ...state,
                bookmarks: state.bookmarks.includes(action.payload)
                    ? state.bookmarks.filter((id) => id !== action.payload)
                    : [...state.bookmarks, action.payload],
                lastVisited: new Date().toISOString(),
            };

        case "SET_THEME":
            return { ...state, themeMode: action.payload };

        case "SET_LANGUAGE":
            return { ...state, language: action.payload };

        case "RESET":
            return { ...DEFAULT_PROGRESS };

        default:
            return state;
    }
}

// ─── Provider ──────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [progress, dispatch] = useReducer(progressReducer, DEFAULT_PROGRESS);
    const isInitialMount = useRef(true);

    // โหลด data จาก localStorage ตอน mount
    useEffect(() => {
        const saved = loadProgress();
        if (saved) {
            dispatch({ type: "LOAD", payload: saved });
        }
        // เปิด auto-save หลัง initial load (setTimeout ให้ LOAD render ก่อน)
        setTimeout(() => {
            isInitialMount.current = false;
        }, 0);
    }, []);

    // Auto-save ทุกครั้งที่ progress เปลี่ยน (ข้าม initial mount)
    useEffect(() => {
        if (isInitialMount.current) return;
        saveProgress(progress);
    }, [progress]);

    const completeLesson = useCallback((lessonId: string) => {
        dispatch({ type: "COMPLETE_LESSON", payload: lessonId });
    }, []);

    const toggleBookmark = useCallback((lessonId: string) => {
        dispatch({ type: "TOGGLE_BOOKMARK", payload: lessonId });
    }, []);

    const setThemeMode = useCallback((mode: "light" | "dark") => {
        dispatch({ type: "SET_THEME", payload: mode });
    }, []);

    const setLanguage = useCallback((lang: "th" | "en") => {
        dispatch({ type: "SET_LANGUAGE", payload: lang });
    }, []);

    const resetProgress = useCallback(() => {
        clearProgress();
        dispatch({ type: "RESET" });
    }, []);

    return (
        <ProgressContext.Provider
            value={{
                progress,
                completeLesson,
                toggleBookmark,
                setThemeMode,
                setLanguage,
                resetProgress,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────

export function useProgress(): ProgressContextType {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error("useProgress must be used within a ProgressProvider");
    }
    return context;
}
