/**
 * Shared step control component for algorithm visualizations
 * Provides play/pause, navigation, and reset controls
 */

'use client';

import { UseStepPlaybackResult } from '../../hooks/useStepPlayback';

interface StepControlsProps {
  playback: UseStepPlaybackResult;
  totalSteps: number;
}

export default function StepControls({ playback, totalSteps }: StepControlsProps) {
  const { currentStep, isPlaying, togglePlay, prev, next, reset, canGoNext, canGoPrev } = playback;

  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ background: 'var(--panel-light)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          disabled={!canGoNext}
          className="px-4 py-2 text-xs font-mono font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: isPlaying ? 'rgba(0, 255, 204, 0.15)' : 'var(--panel)',
            border: `1px solid ${isPlaying ? 'var(--accent-primary)' : 'var(--border)'}`,
            color: isPlaying ? 'var(--accent-primary)' : 'var(--foreground)'
          }}
        >
          {isPlaying ? '▶ ACTIVE' : '⏸ PAUSED'}
        </button>
        <div className="w-px h-6" style={{ background: 'var(--border)' }}></div>
        <button
          onClick={prev}
          disabled={!canGoPrev}
          className="px-3 py-2 text-xs font-mono transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          ◄
        </button>
        <button
          onClick={next}
          disabled={!canGoNext}
          className="px-3 py-2 text-xs font-mono transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          ►
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 text-xs font-mono transition-all"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--foreground-muted)' }}
        >
          ⟲ RESET
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-xs font-mono opacity-60">
          STEP {currentStep + 1} / {totalSteps}
        </div>
        <div className="w-2 h-2 animate-pulse-glow" style={{ background: 'var(--success)' }}></div>
      </div>
    </div>
  );
}
