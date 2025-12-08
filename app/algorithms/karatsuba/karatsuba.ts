/**
 * Pure algorithm implementation for Karatsuba Integer Multiplication
 * Uses divide-and-conquer approach with O(n^log₂3) ≈ O(n^1.585) time complexity
 */

import { KaratsubaStep, KaratsubaResult } from './types';
import { addStrings, subtractStrings, multiplyByPowerOf10, normalizeNumberString } from './stringMath';

/**
 * Recursive Karatsuba multiplication algorithm
 */
function karatsubaRecursive(
  x: string,
  y: string,
  level: number,
  allSteps: KaratsubaStep[]
): string {
  // Clean and normalize input
  x = normalizeNumberString(x);
  y = normalizeNumberString(y);

  const n = Math.max(x.length, y.length);

  // Base case: use native multiplication for small numbers
  if (n <= 2) {
    const result = (BigInt(x) * BigInt(y)).toString();
    allSteps.push({
      type: 'multiply',
      num1: x,
      num2: y,
      result,
      description: `Base case: ${x} × ${y} = ${result}`,
      level,
    });
    return result;
  }

  // Make lengths equal by padding with zeros
  x = x.padStart(n, '0');
  y = y.padStart(n, '0');

  const mid = Math.floor(n / 2);

  // Split numbers into high and low parts
  const a = x.substring(0, x.length - mid);
  const b = x.substring(x.length - mid);
  const c = y.substring(0, y.length - mid);
  const d = y.substring(y.length - mid);

  allSteps.push({
    type: 'divide',
    num1: x,
    num2: y,
    a,
    b,
    c,
    d,
    description: `Divide: ${x} = ${a}×10^${mid} + ${b}, ${y} = ${c}×10^${mid} + ${d}`,
    level,
  });

  // Three recursive multiplications (Karatsuba's key insight)
  const ac = karatsubaRecursive(a, c, level + 1, allSteps);
  const bd = karatsubaRecursive(b, d, level + 1, allSteps);

  const aPlusB = addStrings(a, b);
  const cPlusD = addStrings(c, d);
  const abcd = karatsubaRecursive(aPlusB, cPlusD, level + 1, allSteps);

  // Calculate (a+b)(c+d) - ac - bd = ad + bc
  const adPlusBc = subtractStrings(subtractStrings(abcd, ac), bd);

  allSteps.push({
    type: 'combine',
    num1: x,
    num2: y,
    ac,
    bd,
    adPlusBc,
    description: `Combine: ac=${ac}, bd=${bd}, (ad+bc)=${adPlusBc}`,
    level,
  });

  // Combine results: ac × 10^(2×mid) + (ad+bc) × 10^mid + bd
  const acShifted = multiplyByPowerOf10(ac, 2 * mid);
  const adPlusBcShifted = multiplyByPowerOf10(adPlusBc, mid);

  let result = addStrings(acShifted, adPlusBcShifted);
  result = addStrings(result, bd);

  allSteps.push({
    type: 'multiply',
    num1: x,
    num2: y,
    result,
    description: `Result: ${x} × ${y} = ${result}`,
    level,
  });

  return result;
}

/**
 * Main function to multiply two large integers using Karatsuba algorithm
 * @param num1 - First number as string
 * @param num2 - Second number as string
 * @returns Result containing product and algorithm steps
 */
export function karatsuba(num1: string, num2: string): KaratsubaResult {
  const allSteps: KaratsubaStep[] = [];

  // Clean inputs
  const n1 = normalizeNumberString(num1);
  const n2 = normalizeNumberString(num2);

  allSteps.push({
    type: 'divide',
    num1: n1,
    num2: n2,
    description: `Start: Multiply ${n1} (${n1.length} digits) × ${n2} (${n2.length} digits)`,
    level: 0,
  });

  const result = karatsubaRecursive(n1, n2, 0, allSteps);

  allSteps.push({
    type: 'result',
    num1: n1,
    num2: n2,
    result,
    description: `Final Result: ${n1} × ${n2} = ${result}`,
    level: 0,
  });

  return {
    result,
    steps: allSteps,
  };
}
