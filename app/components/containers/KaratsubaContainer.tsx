/**
 * Container component for Karatsuba visualization
 * Manages state and coordinates between algorithm, UI, and visualization
 */

'use client';

import { useMemo } from 'react';
import { karatsuba } from '../../algorithms/karatsuba';
import { parseKaratsubaInput } from '../../utils/fileParser';
import { useStepPlayback } from '../../hooks/useStepPlayback';
import StepControls from '../ui/StepControls';
import StepDescription from '../ui/StepDescription';
import PanelHeader from '../ui/PanelHeader';
import KaratsubaStepDisplay from './KaratsubaStepDisplay';
import KaratsubaInfoPanel from './KaratsubaInfoPanel';

interface KaratsubaContainerProps {
  fileContent: string;
}

export default function KaratsubaContainer({ fileContent }: KaratsubaContainerProps) {
  // Parse input file
  const parseResult = useMemo(() => parseKaratsubaInput(fileContent), [fileContent]);

  // Run algorithm when numbers are available
  const algorithmResult = useMemo(() => {
    if (!parseResult.success || !parseResult.data) return null;
    const [num1, num2] = parseResult.data;
    return karatsuba(num1, num2);
  }, [parseResult]);

  // Setup step playback
  const playback = useStepPlayback(algorithmResult?.steps.length || 0, 2000);
  const { currentStep } = playback;

  // Handle parse errors
  if (!parseResult.success || !parseResult.data) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center p-8">
          <p className="text-sm font-mono" style={{ color: 'var(--error)' }}>
            {parseResult.error || 'Failed to parse input'}
          </p>
        </div>
      </div>
    );
  }

  if (!algorithmResult) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center p-8">
          <p className="text-sm font-mono" style={{ color: 'var(--foreground-muted)' }}>
            Running algorithm...
          </p>
        </div>
      </div>
    );
  }

  const currentStepData = algorithmResult.steps[currentStep];
  const isLastStep = currentStep === algorithmResult.steps.length - 1;

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Controls */}
      <StepControls playback={playback} totalSteps={algorithmResult.steps.length} />

      {/* Step Description */}
      {currentStepData && <StepDescription description={currentStepData.description} />}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Step Visualization */}
        <div className="flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
          <PanelHeader title="MULTIPLICATION STEPS" accentColor="var(--accent-secondary)" />
          <KaratsubaStepDisplay step={currentStepData} />
        </div>

        {/* Information Panel */}
        <KaratsubaInfoPanel finalResult={algorithmResult.result} showResult={isLastStep} />
      </div>
    </div>
  );
}
