/**
 * Custom hook for managing step playback in algorithm visualizations
 * Provides play/pause, navigation, and automatic progression functionality
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseStepPlaybackResult {
  currentStep: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  goToStep: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

/**
 * Hook for managing algorithm step playback
 * @param totalSteps - Total number of steps in the algorithm
 * @param interval - Time in milliseconds between auto-play steps (default: 1500ms)
 */
export function useStepPlayback(
  totalSteps: number,
  interval: number = 1500
): UseStepPlaybackResult {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= totalSteps - 1) {
      // Already at the end, stop playing
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= totalSteps - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, interval);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, interval]);

  const play = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setIsPlaying(true);
    }
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1));
    setIsPlaying(false);
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(totalSteps - 1, step)));
    setIsPlaying(false);
  }, [totalSteps]);

  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrev = currentStep > 0;

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    togglePlay,
    next,
    prev,
    reset,
    goToStep,
    canGoNext,
    canGoPrev,
  };
}
