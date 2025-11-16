'use client';

interface AlgorithmSelectorProps {
    selectedAlgorithm: 'closest-pair' | 'integer-mult' | null;
    onSelectAlgorithm: (algorithm: 'closest-pair' | 'integer-mult') => void;
}

export default function AlgorithmSelector({ selectedAlgorithm, onSelectAlgorithm }: AlgorithmSelectorProps) {
    return (
        <div className="border border-border bg-card/30">
            <div className="px-3 py-2 border-b border-border bg-muted/10">
                <span className="text-xs font-mono text-muted-foreground">SELECT_ALGORITHM</span>
            </div>
            <div className="p-3">

                <div className="space-y-3">
                    <button
                        onClick={() => onSelectAlgorithm('closest-pair')}
                        className={`w-full p-4 text-left transition-all border ${selectedAlgorithm === 'closest-pair'
                            ? 'bg-accent/15 text-foreground border-accent/60'
                            : 'bg-card/20 text-foreground border-border hover:border-teal-deep'
                            }`}
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <h3 className="text-sm font-medium">Closest Pair</h3>
                                <div className={`w-1 h-1 mt-1 ${selectedAlgorithm === 'closest-pair' ? 'bg-accent' : 'bg-border'
                                    }`}></div>
                            </div>
                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                Find nearest points in 2D Euclidean space using divide and conquer
                            </p>
                            <p className="text-xs font-mono text-muted-foreground/70">
                                T(n) = O(n log n)
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => onSelectAlgorithm('integer-mult')}
                        className={`w-full p-4 text-left transition-all border ${selectedAlgorithm === 'integer-mult'
                            ? 'bg-accent/15 text-foreground border-accent/60'
                            : 'bg-card/20 text-foreground border-border hover:border-teal-deep'
                            }`}
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <h3 className="text-sm font-medium">Karatsuba Multiplication</h3>
                                <div className={`w-1 h-1 mt-1 ${selectedAlgorithm === 'integer-mult' ? 'bg-accent' : 'bg-border'
                                    }`}></div>
                            </div>
                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                Fast multiplication algorithm for large integers
                            </p>
                            <p className="text-xs font-mono text-muted-foreground/70">
                                T(n) = O(n^1.585)
                            </p>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
}
