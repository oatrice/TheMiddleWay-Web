'use client';

import { useState } from 'react';
import { uploadContentCsv, UploadResponse } from '@/lib/services/contentService';
import { CsvValidationError } from '@/lib/types/content';
import { Loader2, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';

export default function CsvUploadForm() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<CsvValidationError[] | null>(null);
    const [successCount, setSuccessCount] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset state
        setIsProcessing(true);
        setErrors(null);
        setSuccessCount(null);
        setErrorMessage(null);

        try {
            const result: UploadResponse = await uploadContentCsv(file);

            if (result.status === 'success') {
                setSuccessCount(result.count || 0);
                e.target.value = ''; // Reset file input
            } else {
                setErrors(result.errors || []);
                setErrorMessage(result.message);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setErrorMessage('Unexpected error processing file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
                <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Upload Content CSV</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Select a .csv file containing standard weekly content columns.
                    <br />
                    <span className="text-xs text-blue-500">Processed by Go Backend</span>
                </p>
            </div>

            <div className="flex justify-center">
                <label className="relative cursor-pointer bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            <span>Uploading & Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Select CSV File</span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                disabled={isProcessing}
                                className="hidden"
                            />
                        </>
                    )}
                </label>
            </div>

            {/* Success State */}
            {successCount !== null && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-green-900">Import Successful!</h3>
                        <p className="text-sm text-green-700 mt-1">
                            Backend processed and saved <strong>{successCount}</strong> content items.
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {(errorMessage || (errors && errors.length > 0)) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-medium text-red-900">Validation Failed</h3>
                    </div>

                    {errorMessage && <p className="text-sm text-red-700 mb-2">{errorMessage}</p>}

                    {errors && errors.length > 0 && (
                        <ul className="space-y-2 text-sm text-red-700 list-disc list-inside bg-white/50 p-3 rounded border border-red-100 max-h-60 overflow-y-auto">
                            {errors.map((err, idx) => (
                                <li key={idx}>
                                    <span className="font-semibold">Row {err.row}:</span> {err.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
