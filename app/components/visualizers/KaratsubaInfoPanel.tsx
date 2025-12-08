/**
 * Information panel for Karatsuba visualization
 * Displays final result and complexity information
 */

'use client';

interface KaratsubaInfoPanelProps {
  finalResult: string | null;
  showResult: boolean;
}

export default function KaratsubaInfoPanel({ finalResult, showResult }: KaratsubaInfoPanelProps) {
  return (
    <div className="flex flex-col">
      {showResult && finalResult && (
        <div>
          <div className="px-4 py-3 flex items-center space-x-2" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
            <div className="w-1 h-1 animate-pulse-glow" style={{ background: 'var(--success)' }}></div>
            <h3 className="text-xs font-mono font-bold">
              FINAL OUTPUT
            </h3>
          </div>
          <div className="p-4" style={{ background: 'var(--panel-light)' }}>
            <div className="p-4 font-mono" style={{ background: 'var(--panel)', border: '2px solid var(--accent-primary)' }}>
              <div style={{ color: 'var(--foreground-muted)' }} className="text-xs mb-2">PRODUCT</div>
              <div style={{ color: 'var(--accent-primary)' }} className="text-sm break-all font-bold leading-relaxed">
                {finalResult}
              </div>
              <div style={{ color: 'var(--foreground-muted)' }} className="text-xs mt-2">
                {finalResult.length} digits
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <div className="px-4 py-3 flex items-center space-x-2" style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="w-1 h-1" style={{ background: 'var(--accent-tertiary)' }}></div>
          <h3 className="text-xs font-mono font-bold">
            ALGORITHM INFO
          </h3>
        </div>
        <div className="p-4 space-y-3" style={{ background: 'var(--panel-light)' }}>
          <div className="p-3" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>
              COMPLEXITY
            </div>
            <div className="text-sm font-mono mt-1" style={{ color: 'var(--accent-tertiary)' }}>
              T(n) = O(n<sup>log₂3</sup>) ≈ O(n<sup>1.585</sup>)
            </div>
          </div>
          <div className="p-3" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>
              METHOD
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--foreground)' }}>
              Divide & Conquer
            </div>
          </div>
          <div className="p-3" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>
              RECURSIVE CALLS
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--foreground)' }}>
              3 per level (vs 4 in naive)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
