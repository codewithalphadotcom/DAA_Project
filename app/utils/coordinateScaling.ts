/**
 * Coordinate scaling utilities for SVG visualization
 * Handles scaling and transforming point coordinates to fit within SVG viewport
 */

import { Point } from '../algorithms/closestPair/types';

export interface Scaler {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  rangeX: number;
  rangeY: number;
  padding: number;
  width: number;
  height: number;
}

/**
 * Create a scaler object from a set of points
 */
export function createScaler(
  points: Point[],
  width: number = 500,
  height: number = 500,
  padding: number = 0.1
): Scaler {
  const xCoords = points.map((p) => p.x);
  const yCoords = points.map((p) => p.y);
  
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);
  
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return {
    minX,
    maxX,
    minY,
    maxY,
    rangeX,
    rangeY,
    padding,
    width,
    height,
  };
}

/**
 * Scale a point to SVG coordinates
 */
export function scalePoint(point: Point, scaler: Scaler): [number, number] {
  const scaleX = (point.x - scaler.minX) / scaler.rangeX;
  const scaleY = (point.y - scaler.minY) / scaler.rangeY;
  
  const paddedWidth = scaler.width - 2 * scaler.padding * scaler.width;
  const paddedHeight = scaler.height - 2 * scaler.padding * scaler.height;
  
  return [
    scaler.padding * scaler.width + scaleX * paddedWidth,
    scaler.height - (scaler.padding * scaler.height + scaleY * paddedHeight),
  ];
}

/**
 * Scale an x-coordinate value to SVG x-coordinate
 */
export function scaleX(x: number, scaler: Scaler): number {
  const scaleXVal = (x - scaler.minX) / scaler.rangeX;
  const paddedWidth = scaler.width - 2 * scaler.padding * scaler.width;
  return scaler.padding * scaler.width + scaleXVal * paddedWidth;
}

/**
 * Scale a y-coordinate value to SVG y-coordinate
 */
export function scaleY(y: number, scaler: Scaler): number {
  const scaleYVal = (y - scaler.minY) / scaler.rangeY;
  const paddedHeight = scaler.height - 2 * scaler.padding * scaler.height;
  return scaler.height - (scaler.padding * scaler.height + scaleYVal * paddedHeight);
}
