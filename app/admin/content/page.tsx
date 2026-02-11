'use client';

import React from 'react';
import CsvUploadForm from '@/components/admin/CsvUploadForm';
import { useThemeContext as useTheme } from '@/components/ThemeProvider';
import { Upload } from 'lucide-react';

export default function ContentAdminPage() {
    const { theme } = useTheme();

    return (
        <div className={`
      min-h-screen pt-safe pb-safe
      ${theme === 'dark' ? 'bg-slate-900 text-slate-50' : 'bg-slate-50 text-slate-900'}
      transition-colors duration-300
    `}>
            <header className="px-6 py-6 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10 w-full flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            </header>

            <main className="container max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Content Ingestion</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage and upload weekly content via CSV.</p>
                        </div>
                    </div>

                    {/* Form Area using standard HTML instead of shadcn Card */}
                    <div className="mt-8 bg-card rounded-xl border border-border shadow-sm p-6 bg-white dark:bg-slate-800">
                        <CsvUploadForm />
                    </div>
                </section>

                {/* Instructions */}
                <section className="mt-12 bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-border/50">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">CSV Requirements</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                            <span>Headers: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Week, Category, Title, Content</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                            <span>Week: Number 1-8</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                            <span>Category: Exact match (Case sensitive)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-primary/20 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                            <span>UTF-8 Encoding (Recommended)</span>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
