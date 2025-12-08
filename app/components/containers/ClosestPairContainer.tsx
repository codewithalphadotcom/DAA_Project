/**
 * Container component for Closest Pair visualization
 * Manages state and coordinates between algorithm, UI, and visualization
 */

'use client';

import { useMemo } from 'react';
import { findClosestPair } from '../../algorithms/closestPair';
import { parseClosestPairInput } from '../../utils/fileParser';
import { createScaler } from '../../utils/coordinateScaling';
import { useStepPlayback } from '../../hooks/useStepPlayback';
import StepControls from '../ui/StepControls';
import StepDescription from '../ui/StepDescription';
import PanelHeader from '../ui/PanelHeader';
import ClosestPairCanvas from './ClosestPairCanvas';
import ClosestPairInfoPanel from './ClosestPairInfoPanel';

interface ClosestPairContainerProps {
  fileContent: string;
}

export default function ClosestPairContainer({ fileContent }: ClosestPairContainerProps) {
  // Parse input file
  const parseResult = useMemo(() => parseClosestPairInput(fileContent), [fileContent]);

  // Run algorithm when points are available
  const algorithmResult = useMemo(() => {
    if (!parseResult.success || !parseResult.data) return null;
    return findClosestPair(parseResult.data);
  }, [parseResult]);

  // Setup step playback
  const playback = useStepPlayback(algorithmResult?.steps.length || 0, 1500);
  const { currentStep } = playback;

  // Create coordinate scaler
  const scaler = useMemo(() => {
    if (!parseResult.success || !parseResult.data) return null;
    return createScaler(parseResult.data, 500, 500, 0.1);
  }, [parseResult]);

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

  if (!algorithmResult || !scaler) {
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
        {/* Visualization Canvas */}
        <div className="flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
          <PanelHeader title="EUCLIDEAN SPACE" accentColor="var(--accent-primary)" />
          <ClosestPairCanvas currentStepData={currentStepData} scaler={scaler} />
        </div>

        {/* Information Panel */}
        <ClosestPairInfoPanel result={algorithmResult.result} showResult={isLastStep} />
      </div>
    </div>
  );
}
