'use client';

import { useState, useEffect } from 'react';

interface Step {
    type: 'divide' | 'multiply' | 'combine' | 'result';
    num1: string;
    num2: string;
    description: string;
    a?: string;
    b?: string;
    c?: string;
    d?: string;
    ac?: string;
    bd?: string;
    adPlusBc?: string;
    result?: string;
    level: number;
}

export default function IntegerMultVisualizer({ fileContent }: { fileContent: string }) {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [finalResult, setFinalResult] = useState('');

    useEffect(() => {
        parseInput();
    }, [fileContent]);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 2000);
            return () => clearTimeout(timer);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, steps]);

    const parseInput = () => {
        const lines = fileContent.trim().split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return;
        // Clean input to keep only digits
        const n1 = lines[0].trim().replace(/[^0-9]/g, '');
        const n2 = lines[1].trim().replace(/[^0-9]/g, '');
        setNum1(n1);
        setNum2(n2);
        runKaratsuba(n1, n2);
    };

    const addStrings = (num1: string, num2: string): string => {
        let result = '';
        let carry = 0;
        let i = num1.length - 1;
        let j = num2.length - 1;

        while (i >= 0 || j >= 0 || carry > 0) {
            const digit1 = i >= 0 ? parseInt(num1[i]) : 0;
            const digit2 = j >= 0 ? parseInt(num2[j]) : 0;
            const sum = digit1 + digit2 + carry;
            result = (sum % 10) + result;
            carry = Math.floor(sum / 10);
            i--;
            j--;
        }

        return result;
    };

    const subtractStrings = (num1: string, num2: string): string => {
        let result = '';
        let borrow = 0;
        let i = num1.length - 1;
        let j = num2.length - 1;

        // Pad num2 with zeros if needed
        const paddedNum2 = num2.padStart(num1.length, '0');
        j = paddedNum2.length - 1;

        while (i >= 0) {
            let digit1 = parseInt(num1[i]) - borrow;
            const digit2 = parseInt(paddedNum2[i]);

            if (digit1 < digit2) {
                digit1 += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }

            result = (digit1 - digit2) + result;
            i--;
        }

        // Remove leading zeros
        result = result.replace(/^0+/, '') || '0';
        return result;
    };

    const multiplyByPowerOf10 = (num: string, power: number): string => {
        if (num === '0') return '0';
        return num + '0'.repeat(power);
    };

    const karatsubaRecursive = (x: string, y: string, level: number, allSteps: Step[]): string => {
        // Clean and remove non-digit characters, then remove leading zeros
        x = x.replace(/[^0-9]/g, '').replace(/^0+/, '') || '0';
        y = y.replace(/[^0-9]/g, '').replace(/^0+/, '') || '0';

        const n = Math.max(x.length, y.length);

        // Base case
        if (n <= 2) {
            const result = (BigInt(x) * BigInt(y)).toString();
            allSteps.push({
                type: 'multiply',
                num1: x,
                num2: y,
                result,
                description: `Base case: ${x} × ${y} = ${result}`,
                level,
            });
            return result;
        }

        // Make lengths equal
        x = x.padStart(n, '0');
        y = y.padStart(n, '0');

        const mid = Math.floor(n / 2);

        // Split numbers
        const a = x.substring(0, x.length - mid);
        const b = x.substring(x.length - mid);
        const c = y.substring(0, y.length - mid);
        const d = y.substring(y.length - mid);

        allSteps.push({
            type: 'divide',
            num1: x,
            num2: y,
            a,
            b,
            c,
            d,
            description: `Divide: ${x} = ${a}×10^${mid} + ${b}, ${y} = ${c}×10^${mid} + ${d}`,
            level,
        });

        // Three recursive calls
        const ac = karatsubaRecursive(a, c, level + 1, allSteps);
        const bd = karatsubaRecursive(b, d, level + 1, allSteps);

        const aPlusB = addStrings(a, b);
        const cPlusD = addStrings(c, d);
        const abcd = karatsubaRecursive(aPlusB, cPlusD, level + 1, allSteps);

        // Calculate (a+b)(c+d) - ac - bd
        const adPlusBc = subtractStrings(subtractStrings(abcd, ac), bd);

        allSteps.push({
            type: 'combine',
            num1: x,
            num2: y,
            ac,
            bd,
            adPlusBc,
            description: `Combine: ac=${ac}, bd=${bd}, (ad+bc)=${adPlusBc}`,
            level,
        });

        // Combine results: ac * 10^(2*mid) + (ad+bc) * 10^mid + bd
        const acShifted = multiplyByPowerOf10(ac, 2 * mid);
        const adPlusBcShifted = multiplyByPowerOf10(adPlusBc, mid);

        let result = addStrings(acShifted, adPlusBcShifted);
        result = addStrings(result, bd);

        allSteps.push({
            type: 'multiply',
            num1: x,
            num2: y,
            result,
            description: `Result: ${x} × ${y} = ${result}`,
            level,
        });

        return result;
    };

    const runKaratsuba = (n1: string, n2: string) => {
        const allSteps: Step[] = [];

        allSteps.push({
            type: 'divide',
            num1: n1,
            num2: n2,
            description: `Start: Multiply ${n1} (${n1.length} digits) × ${n2} (${n2.length} digits)`,
            level: 0,
        });

        const result = karatsubaRecursive(n1, n2, 0, allSteps);

        allSteps.push({
            type: 'result',
            num1: n1,
            num2: n2,
            result,
            description: `Final Result: ${n1} × ${n2} = ${result}`,
            level: 0,
        });

        setSteps(allSteps);
        setFinalResult(result);
        setCurrentStep(0);
    };

    const currentStepData = steps[currentStep];

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
                    <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded border border-border">
                            L{currentStepData.level}
                        </span>
                        <p className="text-xs text-foreground/80 font-light">
                            {currentStepData.description}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visualization Panel */}
                <div className="rounded border border-border bg-card/50">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-xs font-mono text-muted-foreground">
                            Operation State
                        </h3>
                    </div>
                    <div className="p-6">

                        {currentStepData && (
                            <div className="space-y-4">
                                {currentStepData.type === 'divide' && currentStepData.a && (
                                    <div className="p-4 rounded border border-border space-y-4">
                                        <div className="font-mono text-xs space-y-2">
                                            <p className="text-muted-foreground">x =</p>
                                            <p className="text-sm text-foreground break-all">
                                                {currentStepData.num1}
                                            </p>
                                            <p className="text-foreground/70 mt-2 text-xs">
                                                a = {currentStepData.a} <span className="text-muted-foreground">|</span> b = {currentStepData.b}
                                            </p>
                                        </div>
                                        <div className="font-mono text-xs space-y-2 pt-3 border-t border-border">
                                            <p className="text-muted-foreground">y =</p>
                                            <p className="text-sm text-foreground break-all">
                                                {currentStepData.num2}
                                            </p>
                                            <p className="text-foreground/70 mt-2 text-xs">
                                                c = {currentStepData.c} <span className="text-muted-foreground">|</span> d = {currentStepData.d}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentStepData.type === 'combine' && (
                                    <div className="p-4 rounded border border-border space-y-2 font-mono text-xs">
                                        <p className="text-foreground/70">ac = <span className="text-foreground">{currentStepData.ac}</span></p>
                                        <p className="text-foreground/70">bd = <span className="text-foreground">{currentStepData.bd}</span></p>
                                        <p className="text-foreground/70">(ad + bc) = <span className="text-foreground">{currentStepData.adPlusBc}</span></p>
                                    </div>
                                )}

                                {currentStepData.type === 'multiply' && currentStepData.result && (
                                    <div className="p-4 rounded border border-border space-y-2">
                                        <div className="font-mono text-xs">
                                            <p className="text-foreground/70">
                                                {currentStepData.num1} × {currentStepData.num2}
                                            </p>
                                            <p className="text-sm text-foreground mt-3 break-all">
                                                = {currentStepData.result}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentStepData.type === 'result' && (
                                    <div className="p-6 rounded border border-border bg-muted/30">
                                        <p className="text-xs font-mono text-muted-foreground mb-4">
                                            Final Result
                                        </p>
                                        <div className="font-mono text-xs space-y-2">
                                            <p className="text-foreground/70 break-all">{currentStepData.num1}</p>
                                            <p className="text-foreground/70">×</p>
                                            <p className="text-foreground/70 break-all">{currentStepData.num2}</p>
                                            <p className="text-foreground/70">=</p>
                                            <p className="text-sm text-foreground break-all mt-2">
                                                {currentStepData.result}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Panel */}
                <div className="space-y-4">
                    <div className="rounded border border-border bg-card/50">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-xs font-mono text-muted-foreground">
                                Algorithm Steps
                            </h3>
                        </div>
                        <div className="p-4 text-xs text-foreground/70 space-y-2 font-light">
                            <p>For n-digit integers x and y:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-2 font-mono">
                                <li>x = a·10^m + b, y = c·10^m + d</li>
                                <li>Compute: ac, bd, (a+b)(c+d)</li>
                                <li>ad + bc = (a+b)(c+d) - ac - bd</li>
                                <li>x·y = ac·10^(2m) + (ad+bc)·10^m + bd</li>
                            </ol>
                        </div>
                    </div>

                    {finalResult && currentStep === steps.length - 1 && (
                        <div className="p-6 rounded border border-border bg-muted/30">
                            <p className="text-xs font-mono text-muted-foreground mb-4">
                                Computation Complete
                            </p>
                            <div className="space-y-2 text-xs">
                                <p className="text-foreground/70 font-mono">
                                    Input 1: {num1.length} digits
                                </p>
                                <p className="text-foreground/70 font-mono">
                                    Input 2: {num2.length} digits
                                </p>
                                <p className="text-foreground/70 font-mono">
                                    Output: {finalResult.length} digits
                                </p>
                                <div className="mt-4 p-3 rounded border border-border bg-background">
                                    <p className="text-xs text-muted-foreground mb-2 font-mono">Result:</p>
                                    <p className="font-mono text-xs text-foreground break-all">
                                        {finalResult.length > 100 ? finalResult.substring(0, 100) + '...' : finalResult}
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
                            T(n) = O(n^1.585)
                        </p>
                    </div>

                    <div className="p-4 rounded border border-border">
                        <p className="text-xs text-foreground/70 font-light leading-relaxed">
                            Reduces recursive multiplications from 4 to 3, achieving sub-quadratic performance for large integers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-px bg-border relative">
                <div
                    className="absolute top-0 left-0 h-full bg-foreground transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
