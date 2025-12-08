/**
 * File parsing and validation utilities
 */

import { Point } from '../algorithms/closestPair/types';

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Parse closest pair input file format
 * Expected format:
 * Line 1: n (number of points)
 * Lines 2 to n+1: x y (coordinates of each point)
 */
export function parseClosestPairInput(fileContent: string): ParseResult<Point[]> {
  try {
    const lines = fileContent.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return { success: false, error: 'Empty file' };
    }

    const n = parseInt(lines[0]);
    
    if (isNaN(n) || n <= 0) {
      return { success: false, error: 'Invalid number of points' };
    }

    if (lines.length < n + 1) {
      return { success: false, error: `Expected ${n} points, but found ${lines.length - 1}` };
    }

    const points: Point[] = [];

    for (let i = 1; i <= n && i < lines.length; i++) {
      if (lines[i]) {
        const parts = lines[i].trim().split(/\s+/);
        
        if (parts.length < 2) {
          return { success: false, error: `Invalid point format at line ${i + 1}` };
        }

        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);

        if (isNaN(x) || isNaN(y)) {
          return { success: false, error: `Invalid coordinates at line ${i + 1}` };
        }

        points.push({ x, y, id: i - 1 });
      }
    }

    if (points.length < 2) {
      return { success: false, error: 'Need at least 2 points' };
    }

    return { success: true, data: points };
  } catch (error) {
    return { success: false, error: `Parse error: ${error}` };
  }
}

/**
 * Parse Karatsuba input file format
 * Expected format:
 * Line 1: first number
 * Line 2: second number
 */
export function parseKaratsubaInput(fileContent: string): ParseResult<[string, string]> {
  try {
    const lines = fileContent.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      return { success: false, error: 'Need two numbers (one per line)' };
    }

    // Clean input to keep only digits
    const num1 = lines[0].trim().replace(/[^0-9]/g, '');
    const num2 = lines[1].trim().replace(/[^0-9]/g, '');

    if (num1.length === 0 || num2.length === 0) {
      return { success: false, error: 'Invalid numbers (must contain digits)' };
    }

    return { success: true, data: [num1, num2] };
  } catch (error) {
    return { success: false, error: `Parse error: ${error}` };
  }
}
