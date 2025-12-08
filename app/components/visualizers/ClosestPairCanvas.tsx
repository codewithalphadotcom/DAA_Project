/**
 * SVG canvas component for rendering closest pair visualization
 * Pure presentation component - receives data and renders visually
 */

'use client';

import { Point, ClosestPairStep } from '../../algorithms/closestPair/types';
import { Scaler, scalePoint, scaleX } from '../../utils/coordinateScaling';

interface ClosestPairCanvasProps {
  currentStepData: ClosestPairStep;
  scaler: Scaler;
  width?: number;
  height?: number;
}

export default function ClosestPairCanvas({ 
  currentStepData, 
  scaler,
  width = 500,
  height = 500
}: ClosestPairCanvasProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4" style={{ background: 'var(--panel-light)' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        style={{ background: 'var(--panel)', border: '1px solid var(--border)', maxWidth: '800px', maxHeight: '800px' }}
      >
        {/* Draw all points */}
        {currentStepData?.points.map((point) => {
          const [cx, cy] = scalePoint(point, scaler);
          const isInLeft = currentStepData.left?.some((p) => p.id === point.id);
          const isInRight = currentStepData.right?.some((p) => p.id === point.id);
          const isInStrip = currentStepData.stripPoints?.some((p) => p.id === point.id);
          const isInClosestPair = currentStepData.closestPair?.some((p) => p.id === point.id);

          let color = '#52525b';
          let strokeColor = '#3f3f46';
          if (isInClosestPair) {
            color = '#00ffcc';  // accent-primary
            strokeColor = '#00ffcc';
          } else if (isInStrip) {
            color = '#667eea';  // accent-secondary
            strokeColor = '#667eea';
          } else if (isInLeft) {
            color = '#52525b';
            strokeColor = '#3f3f46';
          } else if (isInRight) {
            color = '#52525b';
            strokeColor = '#3f3f46';
          }

          return (
            <circle
              key={point.id}
              cx={cx}
              cy={cy}
              r={isInClosestPair ? 6 : 4}
              fill={color}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
          );
        })}

        {/* Draw line between closest pair */}
        {currentStepData?.closestPair && (
          <>
            <line
              x1={scalePoint(currentStepData.closestPair[0], scaler)[0]}
              y1={scalePoint(currentStepData.closestPair[0], scaler)[1]}
              x2={scalePoint(currentStepData.closestPair[1], scaler)[0]}
              y2={scalePoint(currentStepData.closestPair[1], scaler)[1]}
              stroke="#00ffcc"
              strokeWidth="4"
              opacity="0.5"
            />
            <line
              x1={scalePoint(currentStepData.closestPair[0], scaler)[0]}
              y1={scalePoint(currentStepData.closestPair[0], scaler)[1]}
              x2={scalePoint(currentStepData.closestPair[1], scaler)[0]}
              y2={scalePoint(currentStepData.closestPair[1], scaler)[1]}
              stroke="#00ffcc"
              strokeWidth="2"
            />
          </>
        )}

        {/* Draw dividing line */}
        {currentStepData?.left && currentStepData?.right && currentStepData.left.length > 0 && (
          <line
            x1={scaleX((currentStepData.left[currentStepData.left.length - 1].x + currentStepData.right[0].x) / 2, scaler)}
            y1={0}
            x2={scaleX((currentStepData.left[currentStepData.left.length - 1].x + currentStepData.right[0].x) / 2, scaler)}
            y2={height}
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="2,6"
            opacity="0.4"
          />
        )}
      </svg>
    </div>
  );
}
