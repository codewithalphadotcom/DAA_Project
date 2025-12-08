/**
 * Information panel for closest pair visualization
 * Displays legend and final results
 */

'use client';

import { ClosestPairResult } from '../../algorithms/closestPair/types';

interface ClosestPairInfoPanelProps {
  result: ClosestPairResult | null;
  showResult: boolean;
}

export default function ClosestPairInfoPanel({ result, showResult }: ClosestPairInfoPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 flex items-center space-x-2" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="w-1 h-1" style={{ background: 'var(--accent-secondary)' }}></div>
        <h3 className="text-xs font-mono font-bold">
          DATA LEGEND
        </h3>
      </div>
      <div className="p-4 space-y-3 text-xs" style={{ background: 'var(--panel-light)' }}>
        <div className="flex items-center justify-between p-2" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
          <span className="font-mono" style={{ color: 'var(--foreground-muted)' }}>Base Points</span>
          <div className="w-3 h-3" style={{ backgroundColor: '#52525b' }}></div>
        </div>
        <div className="flex items-center justify-between p-2" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
          <span className="font-mono" style={{ color: 'var(--foreground-muted)' }}>Strip Region</span>
          <div className="w-3 h-3" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
        </div>
        <div className="flex items-center justify-between p-2" style={{ background: 'var(--panel)', border: '1px solid var(--accent-primary)' }}>
          <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>Closest Pair</span>
          <div className="w-3 h-3 animate-pulse-glow" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
        </div>
      </div>

      {result && showResult && (
        <div className="mt-4">
          <div className="px-4 py-3 flex items-center space-x-2" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
            <div className="w-1 h-1 animate-pulse-glow" style={{ background: 'var(--success)' }}></div>
            <h3 className="text-xs font-mono font-bold">
              OUTPUT
            </h3>
          </div>
          <div className="p-4 space-y-3 text-xs" style={{ background: 'var(--panel-light)' }}>
            <div className="p-3 font-mono" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>P₁</div>
              <div style={{ color: 'var(--accent-primary)' }}>
                ({result.point1.x.toFixed(4)}, {result.point1.y.toFixed(4)})
              </div>
            </div>
            <div className="p-3 font-mono" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>P₂</div>
              <div style={{ color: 'var(--accent-primary)' }}>
                ({result.point2.x.toFixed(4)}, {result.point2.y.toFixed(4)})
              </div>
            </div>
            <div className="p-3 font-mono" style={{ background: 'var(--panel)', border: '1px solid var(--accent-primary)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>DISTANCE</div>
              <div className="text-lg" style={{ color: 'var(--accent-primary)' }}>
                {result.distance.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <div className="px-4 py-3" style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>
            COMPLEXITY
          </div>
          <div className="text-sm font-mono mt-1" style={{ color: 'var(--accent-tertiary)' }}>
            T(n) = O(n log n)
          </div>
        </div>
      </div>
    </div>
  );
}
