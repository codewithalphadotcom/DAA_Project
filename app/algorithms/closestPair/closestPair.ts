/**
 * Pure algorithm implementation for finding the closest pair of points
 * Uses divide-and-conquer approach with O(n log n) time complexity
 */

import { Point, ClosestPairResult, ClosestPairStep } from './types';

/**
 * Calculate Euclidean distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Brute force approach for small number of points (n <= 3)
 */
export function bruteForce(pts: Point[]): ClosestPairResult {
  let minDist = Infinity;
  let pair: [Point, Point] = [pts[0], pts[1]];

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dist = distance(pts[i], pts[j]);
      if (dist < minDist) {
        minDist = dist;
        pair = [pts[i], pts[j]];
      }
    }
  }

  return {
    point1: pair[0],
    point2: pair[1],
    distance: minDist,
  };
}

/**
 * Find closest pair in the strip region between left and right halves
 */
export function stripClosest(strip: Point[], d: number): ClosestPairResult | null {
  let minDist = d;
  let pair: [Point, Point] | null = null;

  const sortedStrip = [...strip].sort((a, b) => a.y - b.y);

  for (let i = 0; i < sortedStrip.length; i++) {
    for (let j = i + 1; j < sortedStrip.length && (sortedStrip[j].y - sortedStrip[i].y) < minDist; j++) {
      const dist = distance(sortedStrip[i], sortedStrip[j]);
      if (dist < minDist) {
        minDist = dist;
        pair = [sortedStrip[i], sortedStrip[j]];
      }
    }
  }

  if (!pair) return null;

  return {
    point1: pair[0],
    point2: pair[1],
    distance: minDist,
  };
}

/**
 * Recursive divide-and-conquer algorithm to find closest pair
 */
function closestPairRecursive(
  pts: Point[],
  allSteps: ClosestPairStep[]
): ClosestPairResult {
  const n = pts.length;

  // Base case: use brute force for small sets
  if (n <= 3) {
    const result = bruteForce(pts);
    allSteps.push({
      type: 'conquer',
      points: pts,
      closestPair: [result.point1, result.point2],
      distance: result.distance,
      description: `Base case: ${n} points. Brute force finds closest pair with distance ${result.distance.toFixed(4)}`,
    });
    return result;
  }

  const mid = Math.floor(n / 2);
  const midPoint = pts[mid];
  const left = pts.slice(0, mid);
  const right = pts.slice(mid);

  allSteps.push({
    type: 'divide',
    points: pts,
    left,
    right,
    description: `Divide: Split ${n} points at x = ${midPoint.x.toFixed(2)} into left (${left.length}) and right (${right.length}) halves`,
  });

  // Recursively find closest pairs in left and right halves
  const leftResult = closestPairRecursive(left, allSteps);
  const rightResult = closestPairRecursive(right, allSteps);

  // Determine minimum distance and corresponding pair
  const minDist = Math.min(leftResult.distance, rightResult.distance);
  let closestResult: ClosestPairResult = 
    leftResult.distance < rightResult.distance ? leftResult : rightResult;

  // Check strip region for potentially closer pairs
  const strip = pts.filter((p) => Math.abs(p.x - midPoint.x) < minDist);

  if (strip.length > 1) {
    allSteps.push({
      type: 'merge',
      points: pts,
      stripPoints: strip,
      description: `Merge: Check ${strip.length} points in strip (within distance ${minDist.toFixed(4)} of dividing line)`,
    });

    const stripResult = stripClosest(strip, minDist);

    if (stripResult && stripResult.distance < minDist) {
      closestResult = stripResult;
      allSteps.push({
        type: 'merge',
        points: pts,
        closestPair: [stripResult.point1, stripResult.point2],
        distance: stripResult.distance,
        description: `Found closer pair in strip with distance ${stripResult.distance.toFixed(4)}`,
      });
    }
  }

  return closestResult;
}

/**
 * Main function to find closest pair of points
 * @param points - Array of points to analyze
 * @returns Result containing closest pair, distance, and algorithm steps
 */
export function findClosestPair(points: Point[]): {
  result: ClosestPairResult;
  steps: ClosestPairStep[];
} {
  // Sort points by x-coordinate for divide-and-conquer
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const allSteps: ClosestPairStep[] = [];

  allSteps.push({
    type: 'divide',
    points: sortedPoints,
    description: `Start: Sorted ${sortedPoints.length} points by x-coordinate`,
  });

  const result = closestPairRecursive(sortedPoints, allSteps);

  allSteps.push({
    type: 'result',
    points: sortedPoints,
    closestPair: [result.point1, result.point2],
    distance: result.distance,
    description: `Final Result: Closest pair found with distance ${result.distance.toFixed(4)}`,
  });

  return {
    result,
    steps: allSteps,
  };
}
