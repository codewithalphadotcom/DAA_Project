/**
 * Closest Pair Visualizer - Refactored wrapper component
 * Delegates to ClosestPairContainer for actual implementation
 */

'use client';

import ClosestPairContainer from './containers/ClosestPairContainer';

export default function ClosestPairVisualizer({ fileContent }: { fileContent: string }) {
  return <ClosestPairContainer fileContent={fileContent} />;
}
