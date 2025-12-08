/**
 * Integer Multiplication Visualizer - Refactored wrapper component
 * Delegates to KaratsubaContainer for actual implementation
 */

'use client';

import KaratsubaContainer from './containers/KaratsubaContainer';

export default function IntegerMultVisualizer({ fileContent }: { fileContent: string }) {
  return <KaratsubaContainer fileContent={fileContent} />;
}
