# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Infrastructure] Persistence Layer: LocalStorage System for Progress Tracking
ISSUE: {
  "title": "[Infrastructure] Persistence Layer: LocalStorage System for Progress Tracking",
  "number": 6
}

GIT CONTEXT:
COMMITS:
33f3eac feat: [Infrastructure] Persistence Layer: LocalStorage S...
6546f36 ci(web): add test step to CI workflow and update review docs
a5afd98 feat(profile): add debug tool to verify progress persistence
d66611b feat(progress): add user progress provider with localStorage sync
ba895bd test(persistence): add unit tests for localStorage progress operations
6c21930 fix: ignore exhaustive-deps for theme initialization
c9070a5 ci: add workflow_dispatch trigger
a2963a5 ci: add web build workflow

STATS:
.github/workflows/web-ci.yml                      |   34 +
 CHANGELOG.md                                      |   11 +
 README.md                                         |    1 +
 app/layout.tsx                                    |   15 +-
 app/profile/page.tsx                              |   11 +-
 code_review.md                                    |  101 +-
 components/DebugProgressControl.tsx               |   64 +
 components/ProgressProvider.tsx                   |  149 +
 components/ThemeProvider.tsx                      |   18 +-
 components/__tests__/ProgressProvider.test.tsx    |  200 ++
 hooks/useTheme.ts                                 |    7 +-
 lib/services/__tests__/persistenceService.test.ts |  144 +
 lib/services/index.ts                             |    2 +
 lib/services/persistenceService.ts                |   78 +
 lib/types/index.ts                                |    3 +
 lib/types/progress.ts                             |   25 +
 package-lock.json                                 | 3445 +++++++++++++++++----
 package.json                                      |   12 +-
 vitest.config.ts                                  |   14 +
 19 files changed, 3672 insertions(+), 662 deletions(-)

KEY FILE DIFFS:
diff --git a/app/layout.tsx b/app/layout.tsx
index 89d7f5a..6bf0ec4 100644
--- a/app/layout.tsx
+++ b/app/layout.tsx
@@ -3,6 +3,7 @@ import { Outfit, Inter } from "next/font/google";
 import "./globals.css";
 import { MobileNavigation } from "@/components/layout/MobileNavigation";
 import { ThemeProvider } from "@/components/ThemeProvider";
+import { ProgressProvider } from "@/components/ProgressProvider";
 
 const outfit = Outfit({
   variable: "--font-outfit",
@@ -38,12 +39,14 @@ export default function RootLayout({
       <body
         className={`${outfit.variable} ${inter.variable} antialiased`}
       >
-        <ThemeProvider>
-          <main className="pb-safe min-h-screen">
-            {children}
-          </main>
-          <MobileNavigation />
-        </ThemeProvider>
+        <ProgressProvider>
+          <ThemeProvider>
+            <main className="pb-safe min-h-screen">
+              {children}
+            </main>
+            <MobileNavigation />
+          </ThemeProvider>
+        </ProgressProvider>
       </body>
     </html>
   );
diff --git a/app/profile/page.tsx b/app/profile/page.tsx
index f63dd14..fd55be0 100644
--- a/app/profile/page.tsx
+++ b/app/profile/page.tsx
@@ -1,3 +1,5 @@
+import { DebugProgressControl } from "@/components/DebugProgressControl";
+
 export default function ProfilePage() {
     return (
         <div className="container-mobile py-8">
@@ -9,7 +11,7 @@ export default function ProfilePage() {
                 </p>
             </header>
 
-            <section className="space-y-3">
+            <section className="space-y-3 mb-8">
                 {[
                     { label: "Settings", icon: "⚙️" },
                     { label: "Notifications", icon: "🔔" },
@@ -18,14 +20,17 @@ export default function ProfilePage() {
                 ].map((item) => (
                     <div
                         key={item.label}
-                        className="bg-sand rounded-card p-4 flex items-center gap-4"
+                        className="bg-sand rounded-card p-4 flex items-center gap-4 cursor-pointer hover:bg-sand/80 transition-colors"
                     >
                         <span className="text-xl">{item.icon}</span>
-                        <span className="font-medium flex-1">{item.label}</span>
+                        <span className="font-medium flex-1 text-text-primary">{item.label}</span>
                         <span className="text-slate/40">→</span>
                     </div>
                 ))}
             </section>
+
+            {/* 🛠️ Debug Tool สำหรับ Manual Verify */}
+            <DebugProgressControl />
         </div>
     );
 }
diff --git a/components/DebugProgressControl.tsx b/components/DebugProgressControl.tsx
new file mode 100644
index 0000000..d8dd8ec
--- /dev/null
+++ b/components/DebugProgressControl.tsx
@@ -0,0 +1,64 @@
+"use client";
+
+import { useProgress } from "@/components/ProgressProvider";
+import { motion } from "framer-motion";
+
+export function DebugProgressControl() {
+    const {
+        progress,
+        completeLesson,
+        toggleBookmark,
+        setLanguage,
+        resetProgress,
+    } = useProgress();
+
+    return (
+        <div className="p-4 rounded-lg border border-border/50 bg-surface/50 text-sm space-y-4">
+            <h3 className="font-semibold text-primary">🛠️ Debug: Persistence Control</h3>
+
+            {/* 1. View Data */}
+            <div className="bg-black/5 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap dark:bg-black/30">
+                {JSON.stringify(progress, null, 2)}
+            </div>
+
+            {/* 2. Controls */}
+            <div className="grid grid-cols-2 gap-2">
+                <motion.button
+                    whileTap={{ scale: 0.95 }}
+                    onClick={() => completeLesson(`lesson-${Date.now()}`)}
+                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
+                >
+                    ✅ Complete Lesson (Random)
+                </motion.button>
+
+                <motion.button
+                    whileTap={{ scale: 0.95 }}
+                    onClick={() => toggleBookmark("bookmark-demo")}
+                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
+                >
+                    🔖 Toggle Bookmark
+                </motion.button>
+
+                <motion.button
+                    whileTap={{ scale: 0.95 }}
+                    onClick={() => setLanguage(progress.language === "th" ? "en" : "th")}
+                    className="bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20"
+                >
+                    🌐 Toggle Lang ({progress.language})
+                </motion.button>
+
+                <motion.button
+                    whileTap={{ scale: 0.95 }}
+                    onClick={resetProgress}
+                    className="bg-red-500/10 text-red-500 px-3 py-2 rounded hover:bg-red-500/20 col-span-2 border border-red-500/20"
+                >
+                    ⚠️ Reset All Data
+                </motion.button>
+            </div>
+
+            <p className="text-xs text-slate-500 mt-2">
+                * กดปุ่มแล้วลอง Refresh หน้าเว็บ (data ต้องยังอยู่)
+            </p>
+        </div>
+    );
+}
diff --git a/components/ProgressProvider.tsx b/components/ProgressProvider.tsx
new file mode 100644
index 0000000..1784747
--- /dev/null
+++ b/components/ProgressProvider.tsx
@@ -0,0 +1,149 @@
+"use client";
+
+import {
+    createContext,
+    useContext,
+    useReducer,
+    useEffect,
+    useCallback,
+    useRef,
+    ReactNode,
+} from "react";
+import { UserProgress, DEFAULT_PROGRESS } from "@/lib/types/progress";
+import { saveProgress, loadProgress, clearProgress } from "@/lib/services";
+
+// ─── Context Type ──────────────────────────────────────
+
+interface ProgressContextType {
+    progress: UserProgress;
+    completeLesson: (lessonId: string) => void;
+    toggleBookmark: (lessonId: string) => void;
+    setThemeMode: (mode: "light" | "dark") => void;
+    setLanguage: (lang: "th" | "en") => void;
+    resetProgress: () => void;
+}
+
+const ProgressContext = createContext<ProgressContextType | undefined>(
+    undefined
+);
+
+// ─── Reducer ───────────────────────────────────────────
+
+type ProgressAction =
+    | { type: "LOAD"; payload: UserProgress }
+    | { type: "COMPLETE_LESSON"; payload: string }
+    | { type: "TOGGLE_BOOKMARK"; payload: string }
+    | { type: "SET_THEME"; payload: "light" | "dark" }
+    | { type: "SET_LANGUAGE"; payload: "th" | "en" }
+    | { type: "RESET" };
+
+function progressReducer(
+    state: UserProgress,
+    action: ProgressAction
+): UserProgress {
+    switch (action.type) {
+        case "LOAD":
+            return action.payload;
+
+        case "COMPLETE_LESSON":
+            // ไม่ให้ lesson ซ้ำ
+            if (state.completedLessons.includes(action.payload)) return state;
+            return {
+                ...state,
+                completedLessons: [...state.completedLessons, action.payload],
+                lastVisited: new Date().toISOString(),
+            };
+
+        case "TOGGLE_BOOKMARK":
+            return {
+                ...state,
+                bookmarks: state.bookmarks.includes(action.payload)
+                    ? state.bookmarks.filter((id) => id !== action.payload)
+                    : [...state.bookmarks, action.payload],
+                lastVisited: new Date().toISOString(),
+            };
+
+        case "SET_THEME":
+            return { ...state, themeMode: action.payload };
+
+        case "SET_LANGUAGE":
+            return { ...state, language: action.payload };
+
+        case "RESET":
+            return { ...DEFAULT_PROGRESS };
+
+        default:
+            return state;
+    }
+}
+
+// ─── Provider ──────────────────────────────────────────
+
+export function ProgressProvider({ children }: { children: ReactNode }) {
+    const [progress, dispatch] = useReducer(progressReducer, DEFAULT_PROGRESS);
+    const isInitialMount = useRef(true);
+
+    // โหลด data จาก localStorage ตอน mount
+    useEffect(() => {
+        const saved = loadProgress();
+        if (saved) {
+            dispatch({ type: "LOAD", payload: saved });
+        }
+        // เปิด auto-save หลัง initial load (setTimeout ให้ LOAD render ก่อน)
+        setTimeout(() => {
+            isInitialMount.current = false;
+        }, 0);
+    }, []);
+
+    // Auto-save ทุกครั้งที่ progress เปลี่ยน (ข้าม initial mount)
+    useEffect(() => {
+        if (isInitialMount.current) return;
+        saveProgress(progress);
+    }, [progress]);
+
+    const completeLesson = useCallback((lessonId: string) => {
+        dispatch({ type: "COMPLETE_LESSON", payload: lessonId });
+    }, []);
+
+    const toggleBookmark = useCallback((lessonId: string) => {
+        dispatch({ type: "TOGGLE_BOOKMARK", payload: lessonId });
+    }, []);
+
+    const setThemeMode = useCallback((mode: "light" | "dark") => {
+        dispatch({ type: "SET_THEME", payload: mode });
+    }, []);
+
+    const setLanguage = useCallback((lang: "th" | "en") => {
+        dispatch({ type: "SET_LANGUAGE", payload: lang });
+    }, []);
+
+    const resetProgress = useCallback(() => {
+        clearProgress();
+        dispatch({ type: "RESET" });
+    }, []);
+
+    return (
+        <ProgressContext.Provider
+            value={{
+                progress,
+                completeLesson,
+                toggleBookmark,
+                setThemeMode,
+                setLanguage,
+                resetProgress,
+            }}
+        >
+            {children}
+        </ProgressContext.Provider>
+    );
+}
+
+// ─── Hook ──────────────────────────────────────────────
+
+export function useProgress(): ProgressContextType {
+    const context = useContext(ProgressContext);
+    if (context === undefined) {
+        throw new Error("useProgress must be used within a ProgressProvider");
+    }
+    return context;
+}
diff --git a/components/ThemeProvider.tsx b/components/ThemeProvider.tsx
index 626fd87..095799a 100644
--- a/components/ThemeProvider.tsx
+++ b/components/ThemeProvider.tsx
@@ -1,7 +1,8 @@
 "use client";
 
-import { createContext, useContext, ReactNode } from "react";
+import { createContext, useContext, useEffect, ReactNode } from "react";
 import { useTheme, ThemeMode } from "@/hooks/useTheme";
+import { useProgress } from "@/components/ProgressProvider";
 
 interface ThemeContextType {
     theme: ThemeMode;
@@ -16,6 +17,21 @@ const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
 
 export function ThemeProvider({ children }: { children: ReactNode }) {
     const themeState = useTheme();
+    const { progress, setThemeMode } = useProgress();
+
+    // Sync: เมื่อ progress โหลดค่า theme จาก persistence → set ให้ useTheme
+    useEffect(() => {
+        if (progress.themeMode !== themeState.theme) {
+            themeState.setTheme(progress.themeMode);
+        }
+    }, [progress.themeMode, themeState.theme, themeState.setTheme]);
+
+    // Sync: เมื่อ useTheme toggle → บันทึกกลับไป progress
+    useEffect(() => {
+        if (themeState.theme !== progress.themeMode) {
+            setThemeMode(themeState.theme);
+        }
+    }, [themeState.theme, progress.themeMode, setThemeMode]);
 
     return (
         <ThemeContext.Provider value={themeState}>
diff --git a/components/__tests__/ProgressProvider.test.tsx b/components/__tests__/ProgressProvider.test.tsx
new file mode 100644
index 0000000..ed36af2
--- /dev/null
+++ b/components/__tests__/ProgressProvider.test.tsx
@@ -0,0 +1,200 @@
+import { describe, it, expect, beforeEach, vi } from "vitest";
+import { renderHook, act } from "@testing-library/react";
+import { ReactNode } from "react";
+import { ProgressProvider, useProgress } from "../ProgressProvider";
+
+// ===================================================================
+// 🟥 RED Phase: Failing Tests สำหรับ ProgressProvider
+// ทดสอบการ integrate PersistenceService กับ React Context
+// ===================================================================
+
+// Mock localStorage
+const store: Record<string, string> = {};
+const localStorageMock = {
+    getItem: vi.fn((key: string) => store[key] ?? null),
+    setItem: vi.fn((key: string, value: string) => {
+        store[key] = value;
+    }),
+    removeItem: vi.fn((key: string) => {
+        delete store[key];
+    }),
+    clear: vi.fn(() => {
+        Object.keys(store).forEach((key) => delete store[key]);
+    }),
+    get length() {
+        return Object.keys(store).length;
+    },
+    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
+};
+
+Object.defineProperty(globalThis, "localStorage", {
+    value: localStorageMock,
+});
+
+function wrapper({ children }: { children: ReactNode }) {
+    return <ProgressProvider>{children}</ProgressProvider>;
+}
+
+describe("ProgressProvider + useProgress", () => {
+    beforeEach(() => {
+        localStorageMock.clear();
+        vi.clearAllMocks();
+    });
+
+    // ─── Initialization ──────────────────────────────────
+
+    it("ควรให้ค่า default เมื่อไม่มี saved data", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        expect(result.current.progress.version).toBe(1);
+        expect(result.current.progress.themeMode).toBe("light");
+        expect(result.current.progress.language).toBe("th");
+        expect(result.current.progress.completedLessons).toEqual([]);
+        expect(result.current.progress.bookmarks).toEqual([]);
+    });
+
+    it("ควรโหลด saved data จาก localStorage ตอน mount", () => {
+        const saved = {
+            version: 1,
+            themeMode: "dark" as const,
+            language: "en" as const,
+            completedLessons: ["lesson-1"],
+            bookmarks: [],
+            lastVisited: "2026-02-10T18:00:00Z",
+        };
+        localStorageMock.setItem("theMiddleWay.progress", JSON.stringify(saved));
+
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        expect(result.current.progress.themeMode).toBe("dark");
+        expect(result.current.progress.language).toBe("en");
+        expect(result.current.progress.completedLessons).toEqual(["lesson-1"]);
+    });
+
+    // ─── Lesson Completion ───────────────────────────────
+
+    it("ควร mark lesson ว่า completed ได้", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.completeLesson("lesson-2-eightfold-path");
+        });
+
+        expect(result.current.progress.completedLessons).toContain(
+            "lesson-2-eightfold-path"
+        );
+    });
+
+    it("ไม่ควร duplicate lesson ที่ completed แล้ว", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.completeLesson("lesson-1");
+            result.current.completeLesson("lesson-1");
+        });
+
+        expect(
+            result.current.progress.completedLessons.filter((l) => l === "lesson-1")
+                .length
+        ).toBe(1);
+    });
+
+    // ─── Bookmarks ───────────────────────────────────────
+
+    it("ควร toggle bookmark ได้ (เพิ่ม)", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.toggleBookmark("lesson-3");
+        });
+
+        expect(result.current.progress.bookmarks).toContain("lesson-3");
+    });
+
+    it("ควร toggle bookmark ได้ (ลบ)", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.toggleBookmark("lesson-3");
+        });
+        act(() => {
+            result.current.toggleBookmark("lesson-3");
+        });
+
+        expect(result.current.progress.bookmarks).not.toContain("lesson-3");
+    });
+
+    // ─── Theme ───────────────────────────────────────────
+
+    it("ควร update themeMode ได้", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.setThemeMode("dark");
+        });
+
+        expect(result.current.progress.themeMode).toBe("dark");
+    });
+
+    // ─── Language ────────────────────────────────────────
+
+    it("ควร update language ได้", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.setLanguage("en");
+        });
+
+        expect(result.current.progress.language).toBe("en");
+    });
+
+    // ─── Reset ───────────────────────────────────────────
+
+    it("ควร reset progress กลับเป็น default ได้", () => {
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        act(() => {
+            result.current.completeLesson("lesson-1");
+            result.current.setThemeMode("dark");
+        });
+        act(() => {
+            result.current.resetProgress();
+        });
+
+        expect(result.current.progress.themeMode).toBe("light");
+        expect(result.current.progress.completedLessons).toEqual([]);
+    });
+
+    // ─── Auto-save ───────────────────────────────────────
+
+    it("ควร auto-save ลง localStorage เมื่อ progress เปลี่ยน", () => {
+        vi.useFakeTimers();
+        const { result } = renderHook(() => useProgress(), { wrapper });
+
+        // flush setTimeout(0) ภายใน ProgressProvider ที่ปิด isInitialMount flag
+        act(() => {
+            vi.advanceTimersByTime(1);
+        });
+
+        vi.clearAllMocks(); // เคลียร์ calls จาก initial load
+
+        act(() => {
+            result.current.completeLesson("lesson-1");
+        });
+
+        expect(localStorage.setItem).toHaveBeenCalledWith(
+            "theMiddleWay.progress",
+            expect.stringContaining("lesson-1")
+        );
+
+        vi.useRealTimers();
+    });
+
+    // ─── Error: useProgress outside Provider ─────────────
+
+    it("ควร throw error ถ้าเรียก useProgress นอก Provider", () => {
+        expect(() => {
+            renderHook(() => useProgress());
+        }).toThrow("useProgress must be used within a ProgressProvider");
+    });
+});
diff --git a/hooks/useTheme.ts b/hooks/useTheme.ts
index 892c7ea..a247165 100644
--- a/hooks/useTheme.ts
+++ b/hooks/useTheme.ts
@@ -11,12 +11,8 @@ export function useTheme() {
     const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
     const [mounted, setMounted] = useState(false);
 
-    // Read from localStorage on mount
+    // Set mounted state
     useEffect(() => {
-        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
-        if (stored === "light" || stored === "dark") {
-            setThemeState(stored);
-        }
         setMounted(true);
     }, []);
 
@@ -24,7 +20,6 @@ export function useTheme() {
     useEffect(() => {
         if (!mounted) return;
         document.documentElement.setAttribute("data-theme", theme);
-        localStorage.setItem(STORAGE_KEY, theme);
     }, [theme, mounted]);
 
     const toggleTheme = useCallback(() => {
diff --git a/lib/services/__tests__/persistenceService.test.ts b/lib/services/__tests__/persistenceService.test.ts
new file mode 100644
index 0000000..1001627
--- /dev/null
+++ b/lib/services/__tests__/persistenceService.test.ts
@@ -0,0 +1,144 @@
+import { describe, it, expect, beforeEach, vi } from "vitest";
+import {
+    saveProgress,
+    loadProgress,
+    clearProgress,
+} from "../persistenceService";
+import { UserProgress, DEFAULT_PROGRESS, STORAGE_KEY } from "../../types/progress";
+
+// ===================================================================
+// 🟥 RED Phase: Failing Tests
+// ทดสอบ PersistenceService ทั้ง 3 methods: save, load, clear
+// ===================================================================
+
+// Mock localStorage

... (Diff truncated for size) ...

PR TEMPLATE:


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
