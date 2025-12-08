/**
 * Step display component for Karatsuba visualization
 * Shows the detailed breakdown of multiplication steps
 */

'use client';

import { KaratsubaStep } from '../../algorithms/karatsuba/types';

interface KaratsubaStepDisplayProps {
  step: KaratsubaStep;
}

export default function KaratsubaStepDisplay({ step }: KaratsubaStepDisplayProps) {
  return (
    <div className="p-4 space-y-3" style={{ background: 'var(--panel-light)' }}>
      {/* Input Numbers */}
      <div className="space-y-2">
        <div className="p-3 font-mono text-sm" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--foreground-muted)' }} className="text-xs mb-1">NUM1</div>
          <div style={{ color: 'var(--accent-primary)' }} className="break-all">
            {step.num1}
          </div>
        </div>
        <div className="p-3 font-mono text-sm" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
          <div style={{ color: 'var(--foreground-muted)' }} className="text-xs mb-1">NUM2</div>
          <div style={{ color: 'var(--accent-primary)' }} className="break-all">
            {step.num2}
          </div>
        </div>
      </div>

      {/* Division Details */}
      {step.type === 'divide' && step.a && step.b && step.c && step.d && (
        <div className="space-y-2 mt-4">
          <div className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>
            SPLIT COMPONENTS
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>a = </div>
              <div style={{ color: 'var(--accent-secondary)' }} className="break-all">{step.a}</div>
            </div>
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>b = </div>
              <div style={{ color: 'var(--accent-secondary)' }} className="break-all">{step.b}</div>
            </div>
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>c = </div>
              <div style={{ color: 'var(--accent-secondary)' }} className="break-all">{step.c}</div>
            </div>
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>d = </div>
              <div style={{ color: 'var(--accent-secondary)' }} className="break-all">{step.d}</div>
            </div>
          </div>
        </div>
      )}

      {/* Combination Details */}
      {step.type === 'combine' && step.ac && step.bd && step.adPlusBc && (
        <div className="space-y-2 mt-4">
          <div className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>
            COMBINE RESULTS
          </div>
          <div className="space-y-2">
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>ac = </div>
              <div style={{ color: 'var(--accent-tertiary)' }} className="break-all">{step.ac}</div>
            </div>
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>bd = </div>
              <div style={{ color: 'var(--accent-tertiary)' }} className="break-all">{step.bd}</div>
            </div>
            <div className="p-2 font-mono text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--foreground-muted)' }}>ad+bc = </div>
              <div style={{ color: 'var(--accent-tertiary)' }} className="break-all">{step.adPlusBc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {step.result && (
        <div className="p-3 font-mono text-sm mt-4" style={{ background: 'var(--panel)', border: '2px solid var(--accent-primary)' }}>
          <div style={{ color: 'var(--foreground-muted)' }} className="text-xs mb-1">RESULT</div>
          <div style={{ color: 'var(--accent-primary)' }} className="break-all font-bold">
            {step.result}
          </div>
        </div>
      )}

      {/* Recursion Level Indicator */}
      <div className="flex items-center space-x-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>
          RECURSION LEVEL
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: step.level + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2" 
              style={{ background: i === step.level ? 'var(--accent-primary)' : 'var(--border)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
