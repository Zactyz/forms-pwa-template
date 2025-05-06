import { useState, useCallback } from 'react';
import { AppError, ErrorType, createError, logError } from '@/lib/errorHandler';

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

interface UseTryCatchReturn<T> {
    execute: (...args: Parameters<AsyncFunction<T>>) => Promise<T | undefined>;
    error: AppError | null;
    isLoading: boolean;
    clearError: () => void;
}

/**
 * A hook that wraps async functions in try-catch blocks and handles errors consistently
 * @param asyncFn The async function to execute
 * @param defaultErrorMessage Default error message if none is provided
 * @returns Object with execute function, error state, loading state, and clearError function
 */
export function useTryCatch<T>(
    asyncFn: AsyncFunction<T>,
    defaultErrorMessage = 'An unexpected error occurred'
): UseTryCatchReturn<T> {
    const [error, setError] = useState<AppError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const execute = useCallback(
        async (...args: Parameters<AsyncFunction<T>>): Promise<T | undefined> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await asyncFn(...args);
                return result;
            } catch (err: unknown) {
                const appError = err instanceof Error
                    ? createError(
                        ErrorType.UNKNOWN,
                        err.message || defaultErrorMessage,
                        undefined,
                        err
                    )
                    : createError(
                        ErrorType.UNKNOWN,
                        defaultErrorMessage,
                        undefined,
                        err
                    );

                setError(appError);
                logError(appError);
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [asyncFn, defaultErrorMessage]
    );

    return { execute, error, isLoading, clearError };
} 