'use client';

import { useEffect, useState } from 'react';
import ClosestPairVisualizer from './ClosestPairVisualizer';
import IntegerMultVisualizer from './IntegerMultVisualizer';

interface VisualizerProps {
    algorithm: 'closest-pair' | 'integer-mult';
    fileContent: string;
    fileName: string;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export default function Visualizer({
    algorithm,
    fileContent,
    fileName,
    isProcessing,
    setIsProcessing,
}: VisualizerProps) {
    const [started, setStarted] = useState(false);

    useEffect(() => {
        setStarted(false);
    }, [fileContent, algorithm]);

    return (
        <div className="h-full flex flex-col">
            {/* Control Bar */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 animate-pulse-glow" style={{ background: 'var(--accent-primary)' }}></div>
                        <span className="text-xs font-mono font-bold">
                            {algorithm === 'closest-pair' ? 'GEOMETRIC PROCESSOR' : 'ARITHMETIC PROCESSOR'}
                        </span>
                    </div>
                    {started && (
                        <div className="text-xs font-mono opacity-60">
                            ANALYZING • {algorithm === 'closest-pair' ? 'EUCLIDEAN SPACE' : 'INTEGER DOMAIN'}
                        </div>
                    )}
                </div>
                {!started && (
                    <button
                        onClick={() => setStarted(true)}
                        className="px-6 py-2 text-xs font-mono font-bold transition-all relative overflow-hidden group"
                        style={{
                            background: 'var(--panel-light)',
                            border: '1px solid var(--accent-primary)',
                            color: 'var(--accent-primary)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 255, 204, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--panel-light)'}
                    >
                        INITIALIZE
                    </button>
                )}
            </div>

            {/* Visualization Area */}
            {started ? (
                algorithm === 'closest-pair' ? (
                    <ClosestPairVisualizer fileContent={fileContent} />
                ) : (
                    <IntegerMultVisualizer fileContent={fileContent} />
                )
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 border-2 animate-rotate-slow" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 animate-rotate-slow" style={{ borderColor: 'var(--accent-secondary)', borderBottomColor: 'transparent', animationDirection: 'reverse' }}></div>
                            </div>
                        </div>
                        <div className="text-xs font-mono opacity-60">
                            PROCESSOR READY • AWAITING INITIALIZATION
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
