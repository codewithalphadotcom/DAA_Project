/**
 * Custom hook for running algorithms and managing their state
 * Generic hook that can work with any algorithm function
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseAlgorithmRunnerResult<TResult, TStep> {
  result: TResult | null;
  steps: TStep[];
  isLoading: boolean;
  error: string | null;
  run: () => void;
}

/**
 * Hook for running algorithms with step tracking
 * @param algorithmFn - Function that executes the algorithm and returns result with steps
 * @param shouldRun - Boolean indicating whether to run the algorithm
 */
export function useAlgorithmRunner<TInput, TResult, TStep>(
  algorithmFn: (input: TInput) => { result: TResult; steps: TStep[] },
  input: TInput | null,
  shouldRun: boolean = true
): UseAlgorithmRunnerResult<TResult, TStep> {
  const [result, setResult] = useState<TResult | null>(null);
  const [steps, setSteps] = useState<TStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    if (!input) {
      setError('No input provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { result: algResult, steps: algSteps } = algorithmFn(input);
      setResult(algResult);
      setSteps(algSteps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algorithm execution failed');
      setResult(null);
      setSteps([]);
    } finally {
      setIsLoading(false);
    }
  }, [algorithmFn, input]);

  // Auto-run when input changes if shouldRun is true
  useEffect(() => {
    if (shouldRun && input) {
      run();
    }
  }, [input, shouldRun, run]);

  return {
    result,
    steps,
    isLoading,
    error,
    run,
  };
}
