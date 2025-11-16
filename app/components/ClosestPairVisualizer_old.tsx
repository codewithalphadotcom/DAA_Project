'use client';

import { useState, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
    id: number;
}

interface Step {
    type: 'divide' | 'conquer' | 'merge' | 'result';
    points: Point[];
    left?: Point[];
    right?: Point[];
    closestPair?: [Point, Point];
    distance?: number;
    description: string;
    stripPoints?: Point[];
}

export default function ClosestPairVisualizer({ fileContent }: { fileContent: string }) {
    const [points, setPoints] = useState<Point[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [result, setResult] = useState<{ pair: [Point, Point]; distance: number } | null>(null);

    useEffect(() => {
        parseInput();
    }, [fileContent]);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 1500);
            return () => clearTimeout(timer);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, steps]);

    const parseInput = () => {
        const lines = fileContent.trim().split('\n');
        const n = parseInt(lines[0]);
        const parsedPoints: Point[] = [];

        for (let i = 1; i <= n; i++) {
            const [x, y] = lines[i].split(' ').map(Number);
            parsedPoints.push({ x, y, id: i - 1 });
        }

        setPoints(parsedPoints);
        runAlgorithm(parsedPoints);
    };

    const distance = (p1: Point, p2: Point): number => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const bruteForce = (pts: Point[]): [Point, Point, number] => {
        let minDist = Infinity;
        let pair: [Point, Point] = [pts[0], pts[1]];

        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dist = distance(pts[i], pts[j]);
                if (dist < minDist) {
                    minDist = dist;
                    pair = [pts[i], pts[j]];
                }
            }
        }
        return [...pair, minDist];
    };

    const stripClosest = (strip: Point[], d: number): [Point, Point, number] => {
        let minDist = d;
        let pair: [Point, Point] | null = null;

        strip.sort((a, b) => a.y - b.y);

        for (let i = 0; i < strip.length; i++) {
            for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
                const dist = distance(strip[i], strip[j]);
                if (dist < minDist) {
                    minDist = dist;
                    pair = [strip[i], strip[j]];
                }
            }
        }

        return pair ? [...pair, minDist] : [strip[0], strip[1], minDist];
    };

    const closestPairRecursive = (pts: Point[], allSteps: Step[]): [Point, Point, number] => {
        const n = pts.length;

        if (n <= 3) {
            const [p1, p2, dist] = bruteForce(pts);
            allSteps.push({
                type: 'conquer',
                points: pts,
                closestPair: [p1, p2],
                distance: dist,
                description: `Base case: ${n} points. Brute force finds closest pair with distance ${dist.toFixed(4)}`,
            });
            return [p1, p2, dist];
        }

        const mid = Math.floor(n / 2);
        const midPoint = pts[mid];
        const left = pts.slice(0, mid);
        const right = pts.slice(mid);

        allSteps.push({
            type: 'divide',
            points: pts,
            left,
            right,
            description: `Divide: Split ${n} points at x = ${midPoint.x.toFixed(2)} into left (${left.length}) and right (${right.length}) halves`,
        });

        const [p1Left, p2Left, distLeft] = closestPairRecursive(left, allSteps);
        const [p1Right, p2Right, distRight] = closestPairRecursive(right, allSteps);

        const minDist = Math.min(distLeft, distRight);
        let closestPair: [Point, Point] = distLeft < distRight ? [p1Left, p2Left] : [p1Right, p2Right];

        const strip = pts.filter((p) => Math.abs(p.x - midPoint.x) < minDist);

        if (strip.length > 1) {
            allSteps.push({
                type: 'merge',
                points: pts,
                stripPoints: strip,
                description: `Merge: Check ${strip.length} points in strip (within distance ${minDist.toFixed(4)} of dividing line)`,
            });

            const [p1Strip, p2Strip, distStrip] = stripClosest(strip, minDist);

            if (distStrip < minDist) {
                closestPair = [p1Strip, p2Strip];
                allSteps.push({
                    type: 'merge',
                    points: pts,
                    closestPair,
                    distance: distStrip,
                    description: `Found closer pair in strip with distance ${distStrip.toFixed(4)}`,
                });
                return [...closestPair, distStrip];
            }
        }

        return [...closestPair, minDist];
    };

    const runAlgorithm = (pts: Point[]) => {
        const sortedPoints = [...pts].sort((a, b) => a.x - b.x);
        const allSteps: Step[] = [];

        allSteps.push({
            type: 'divide',
            points: sortedPoints,
            description: `Start: Sorted ${sortedPoints.length} points by x-coordinate`,
        });

        const [p1, p2, dist] = closestPairRecursive(sortedPoints, allSteps);

        allSteps.push({
            type: 'result',
            points: sortedPoints,
            closestPair: [p1, p2],
            distance: dist,
            description: `Final Result: Closest pair found with distance ${dist.toFixed(4)}`,
        });

        setSteps(allSteps);
        setResult({ pair: [p1, p2], distance: dist });
        setCurrentStep(0);
    };

    const currentStepData = steps[currentStep];

    // Calculate bounds for visualization
    const xCoords = points.map((p) => p.x);
    const yCoords = points.map((p) => p.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const padding = 0.1;

    const scale = (x: number, y: number): [number, number] => {
        const scaleX = (x - minX) / rangeX;
        const scaleY = (y - minY) / rangeY;
        return [
            padding * 500 + scaleX * (500 - 2 * padding * 500),
            500 - (padding * 500 + scaleY * (500 - 2 * padding * 500)),
        ];
    };

    return (
        <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between p-4 rounded border border-border bg-muted/30">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={currentStep >= steps.length - 1}
                        className="px-4 py-2 rounded border border-accent bg-accent/10 hover:bg-accent/20 text-foreground text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm shadow-accent/10"
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-3 py-2 rounded border border-border text-foreground text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:border-emerald-subtle hover:bg-emerald-subtle/10"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        disabled={currentStep >= steps.length - 1}
                        className="px-3 py-2 rounded border border-border text-foreground text-xs font-mono disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:border-emerald-subtle hover:bg-emerald-subtle/10"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setCurrentStep(0)}
                        className="px-3 py-2 rounded border border-border/50 text-muted-foreground text-xs font-mono hover:border-emerald-subtle hover:text-foreground transition-all"
                    >
                        Reset
                    </button>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                    {currentStep + 1} / {steps.length}
                </div>
            </div>

            {/* Step Description */}
            {currentStepData && (
                <div className="p-4 rounded border border-border bg-muted/30">
                    <p className="text-xs text-foreground/80 font-light leading-relaxed">
                        {currentStepData.description}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visualization Canvas */}
                <div className="rounded border border-border bg-card/50">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-xs font-mono text-muted-foreground">
                            Point Space
                        </h3>
                    </div>
                    <div className="p-4">
                        <svg width="500" height="500" className="rounded border border-border bg-background">
                            {/* Draw all points */}
                            {currentStepData?.points.map((point) => {
                                const [cx, cy] = scale(point.x, point.y);
                                const isInLeft = currentStepData.left?.some((p) => p.id === point.id);
                                const isInRight = currentStepData.right?.some((p) => p.id === point.id);
                                const isInStrip = currentStepData.stripPoints?.some((p) => p.id === point.id);
                                const isInClosestPair = currentStepData.closestPair?.some((p) => p.id === point.id);

                                let color = '#52525b';
                                let strokeColor = '#3f3f46';
                                if (isInClosestPair) {
                                    color = 'oklch(0.55 0.15 195)';
                                    strokeColor = 'oklch(0.70 0.20 195)';
                                } else if (isInStrip) {
                                    color = 'oklch(0.45 0.10 200)';
                                    strokeColor = 'oklch(0.35 0.10 200)';
                                } else if (isInLeft) {
                                    color = '#52525b';
                                    strokeColor = '#3f3f46';
                                } else if (isInRight) {
                                    color = '#52525b';
                                    strokeColor = '#3f3f46';
                                }

                                return (
                                    <circle
                                        key={point.id}
                                        cx={cx}
                                        cy={cy}
                                        r={isInClosestPair ? 6 : 4}
                                        fill={color}
                                        stroke={strokeColor}
                                        strokeWidth="1.5"
                                    />
                                );
                            })}

                            {/* Draw line between closest pair */}
                            {currentStepData?.closestPair && (
                                <>
                                    <line
                                        x1={scale(currentStepData.closestPair[0].x, currentStepData.closestPair[0].y)[0]}
                                        y1={scale(currentStepData.closestPair[0].x, currentStepData.closestPair[0].y)[1]}
                                        x2={scale(currentStepData.closestPair[1].x, currentStepData.closestPair[1].y)[0]}
                                        y2={scale(currentStepData.closestPair[1].x, currentStepData.closestPair[1].y)[1]}
                                        stroke="oklch(0.55 0.15 195)"
                                        strokeWidth="4"
                                        opacity="0.4"
                                    />
                                    <line
                                        x1={scale(currentStepData.closestPair[0].x, currentStepData.closestPair[0].y)[0]}
                                        y1={scale(currentStepData.closestPair[0].x, currentStepData.closestPair[0].y)[1]}
                                        x2={scale(currentStepData.closestPair[1].x, currentStepData.closestPair[1].y)[0]}
                                        y2={scale(currentStepData.closestPair[1].x, currentStepData.closestPair[1].y)[1]}
                                        stroke="oklch(0.70 0.20 195)"
                                        strokeWidth="2"
                                    />
                                </>
                            )}

                            {/* Draw dividing line */}
                            {currentStepData?.left && currentStepData?.right && currentStepData.left.length > 0 && (
                                <line
                                    x1={scale((currentStepData.left[currentStepData.left.length - 1].x + currentStepData.right[0].x) / 2, minY)[0]}
                                    y1={0}
                                    x2={scale((currentStepData.left[currentStepData.left.length - 1].x + currentStepData.right[0].x) / 2, minY)[0]}
                                    y2={500}
                                    stroke="oklch(0.28 0.035 210 / 25%)"
                                    strokeWidth="1"
                                    strokeDasharray="4,4"
                                />
                            )}
                        </svg>
                    </div>
                </div>

                {/* Information Panel */}
                <div className="space-y-4">
                    <div className="rounded border border-border bg-card/50">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-xs font-mono text-muted-foreground">
                                Legend
                            </h3>
                        </div>
                        <div className="p-4 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-light">All Points</span>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#52525b' }}></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-light">Strip Region</span>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.55 0.05 145)' }}></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-light">Closest Pair</span>
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: 'oklch(0.40 0.10 155)', boxShadow: '0 0 8px oklch(0.40 0.10 155 / 30%)' }}></div>
                            </div>
                        </div>
                    </div>

                    {result && currentStep === steps.length - 1 && (
                        <div className="p-6 rounded border border-border bg-muted/30">
                            <div className="space-y-3 text-xs">
                                <p className="font-mono text-muted-foreground mb-4">
                                    Result
                                </p>
                                <div className="space-y-2 text-foreground/80">
                                    <p className="font-mono">
                                        P₁: ({result.pair[0].x.toFixed(4)}, {result.pair[0].y.toFixed(4)})
                                    </p>
                                    <p className="font-mono">
                                        P₂: ({result.pair[1].x.toFixed(4)}, {result.pair[1].y.toFixed(4)})
                                    </p>
                                    <p className="font-mono pt-3 border-t border-border">
                                        d = {result.distance.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-4 rounded border border-border bg-muted/30">
                        <p className="text-xs font-mono text-muted-foreground mb-2">
                            Complexity
                        </p>
                        <p className="text-xs text-foreground/80 font-mono">
                            T(n) = O(n log n)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
