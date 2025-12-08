/**
 * Shared algorithm types for all divide-and-conquer algorithms
 */

export interface AlgorithmStep {
  description: string;
  level: number;
}

export interface AlgorithmResult<T> {
  result: T;
  steps: AlgorithmStep[];
}
