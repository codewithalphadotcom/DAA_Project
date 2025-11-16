'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
    onFileUpload: (content: string, fileName: string) => void;
    selectedAlgorithm: 'closest-pair' | 'integer-mult' | null;
    fileName: string;
}

export default function FileUpload({ onFileUpload, selectedAlgorithm, fileName }: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError('');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError('');
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!selectedAlgorithm) {
            setError('Please select an algorithm first!');
            return;
        }

        if (!file.name.endsWith('.txt')) {
            setError('Please upload a .txt file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileUpload(content, file.name);
        };
        reader.onerror = () => {
            setError('Error reading file');
        };
        reader.readAsText(file);
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 h-full">
            <h2 className="text-sm font-mono text-muted-foreground mb-6 tracking-wide">
                Input File
            </h2>

            <div
                className={`relative border border-dashed rounded p-12 transition-all duration-150 ${dragActive
                    ? 'border-accent bg-accent/5 shadow-inner shadow-accent/10'
                    : 'border-border hover:border-emerald-subtle'
                    } ${!selectedAlgorithm ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={selectedAlgorithm ? onButtonClick : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleChange}
                    className="hidden"
                    disabled={!selectedAlgorithm}
                />

                <div className="flex flex-col items-center space-y-6">
                    {fileName ? (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center">
                                <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-mono text-foreground">
                                    {fileName}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onButtonClick();
                                    }}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                                >
                                    change file
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 mx-auto flex items-center justify-center">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-foreground font-light">
                                    {selectedAlgorithm ? 'Drop file or click to browse' : 'Select an algorithm first'}
                                </p>
                                {selectedAlgorithm && (
                                    <p className="text-xs text-muted-foreground font-mono">
                                        .txt files only
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mx-6 mb-6 p-4 rounded border border-border bg-muted/30">
                    <p className="text-xs text-muted-foreground font-mono">
                        {error}
                    </p>
                </div>
            )}

            {selectedAlgorithm && (
                <div className="px-6 pb-6">
                    <div className="p-4 rounded border border-border bg-muted/30">
                        <p className="text-xs font-mono text-muted-foreground mb-3">
                            Expected Format
                        </p>
                        <pre className="text-xs text-foreground/80 font-mono leading-relaxed">
                            {selectedAlgorithm === 'closest-pair'
                                ? 'n\nx₁ y₁\nx₂ y₂\n...\nxₙ yₙ'
                                : 'integer₁\ninteger₂'}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
