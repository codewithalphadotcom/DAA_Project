/**
 * Types for Karatsuba Integer Multiplication algorithm
 */

export interface KaratsubaStep {
  type: 'divide' | 'multiply' | 'combine' | 'result';
  num1: string;
  num2: string;
  description: string;
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  ac?: string;
  bd?: string;
  adPlusBc?: string;
  result?: string;
  level: number;
}

export interface KaratsubaResult {
  result: string;
  steps: KaratsubaStep[];
}
