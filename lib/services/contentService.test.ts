import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { uploadContentCsv, API_BASE_URL } from './contentService';

describe('contentService', () => {
    describe('uploadContentCsv', () => {
        let fetchMock: Mock;

        beforeEach(() => {
            fetchMock = vi.fn();
            global.fetch = fetchMock;
        });

        it('should return success response when upload succeeds', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ status: 'success', message: 'OK', count: 5 }),
            });

            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
            const result = await uploadContentCsv(file);

            expect(result).toEqual({ status: 'success', message: 'OK', count: 5 });
            expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/content/upload`, expect.objectContaining({
                method: 'POST',
                body: expect.any(FormData),
            }));
        });

        it('should return error response when backend returns failure', async () => {
            fetchMock.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ status: 'error', message: 'Failed', errors: [{ row: 1, message: 'Bad' }] }),
            });

            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
            const result = await uploadContentCsv(file);

            expect(result).toEqual({
                status: 'error',
                message: 'Failed',
                errors: [{ row: 1, message: 'Bad' }],
            });
        });

        it('should handle network errors gracefully', async () => {
            fetchMock.mockRejectedValueOnce(new Error('Network Error'));

            const file = new File(['csv content'], 'test.csv', { type: 'text/csv' });
            const result = await uploadContentCsv(file);

            expect(result).toEqual({
                status: 'error',
                message: expect.stringContaining('Network error'),
                errors: [{ row: 0, message: expect.stringContaining('Could not connect') }],
            });
        });
    });
});
