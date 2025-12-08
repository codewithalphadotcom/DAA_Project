/**
 * Types for Closest Pair of Points algorithm
 */

export interface Point {
  x: number;
  y: number;
  id: number;
}

export interface ClosestPairResult {
  point1: Point;
  point2: Point;
  distance: number;
}

export interface ClosestPairStep {
  type: 'divide' | 'conquer' | 'merge' | 'result';
  points: Point[];
  left?: Point[];
  right?: Point[];
  closestPair?: [Point, Point];
  distance?: number;
  description: string;
  stripPoints?: Point[];
}
