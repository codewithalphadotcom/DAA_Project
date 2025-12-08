'use client';

import { useState } from 'react';

interface SampleFileSelectorProps {
    selectedAlgorithm: 'closest-pair' | 'integer-mult' | null;
    onFileSelect: (content: string, fileName: string) => void;
}

const SAMPLE_FILES = {
    'closest-pair': [
        { name: 'input_01_small.txt', label: 'Small (100 points)', description: '100 points' },
        { name: 'input_02_medium.txt', label: 'Medium (500 points)', description: '500 points' },
        { name: 'input_03_large.txt', label: 'Large (1,000 points)', description: '1K points' },
        { name: 'input_04_xlarge.txt', label: 'XLarge (5,000 points)', description: '5K points' },
        { name: 'input_05_clustered.txt', label: 'Clustered (1,000 points)', description: 'Grouped data' },
        { name: 'input_06_sparse.txt', label: 'Sparse (1,000 points)', description: 'Spread out' },
        { name: 'input_07_mixed.txt', label: 'Mixed (2,000 points)', description: 'Varied density' },
        { name: 'input_08_dense.txt', label: 'Dense (3,000 points)', description: 'Packed data' },
        { name: 'input_09_huge.txt', label: 'Huge (10,000 points)', description: '10K points' },
        { name: 'input_10_extreme.txt', label: 'Extreme (50,000 points)', description: '50K points' },
    ],
    'integer-mult': [
        { name: 'input_01_small.txt', label: 'Small (100 digits)', description: '100 digits' },
        { name: 'input_02_medium.txt', label: 'Medium (500 digits)', description: '500 digits' },
        { name: 'input_03_large.txt', label: 'Large (1,000 digits)', description: '1K digits' },
        { name: 'input_04_xlarge.txt', label: 'XLarge (5,000 digits)', description: '5K digits' },
        { name: 'input_05_asymmetric.txt', label: 'Asymmetric', description: 'Different sizes' },
        { name: 'input_06_very_asymmetric.txt', label: 'Very Asymmetric', description: 'Large difference' },
        { name: 'input_07_huge.txt', label: 'Huge (10,000 digits)', description: '10K digits' },
        { name: 'input_08_mixed.txt', label: 'Mixed Sizes', description: 'Various lengths' },
        { name: 'input_09_extreme.txt', label: 'Extreme (50,000 digits)', description: '50K digits' },
        { name: 'input_10_massive.txt', label: 'Massive (100,000 digits)', description: '100K digits' },
    ],
};

export default function SampleFileSelector({ selectedAlgorithm, onFileSelect }: SampleFileSelectorProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = async (fileName: string) => {
        if (!selectedAlgorithm) return;

        setLoading(true);
        setSelectedFile(fileName);

        try {
            const folderName = selectedAlgorithm === 'closest-pair' ? 'closest_pair' : 'integer_multiplication';
            const response = await fetch(`/test_data/${folderName}/${fileName}`);

            if (!response.ok) throw new Error('Failed to load file');

            const content = await response.text();
            onFileSelect(content, fileName);
        } catch (error) {
            console.error('Error loading sample file:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedAlgorithm) {
        return (
            <div className="border border-border bg-card/30">
                <div className="p-3">
                    <p className="text-xs text-muted-foreground font-mono">
                        {"// Select algorithm first"}
                    </p>
                </div>
            </div>
        );
    }

    const files = SAMPLE_FILES[selectedAlgorithm];

    return (
        <div className="border border-border bg-card/30">
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {files.map((file, index) => (
                    <button
                        key={file.name}
                        onClick={() => handleFileSelect(file.name)}
                        disabled={loading}
                        className={`w-full text-left p-2 border-b border-border transition-all ${selectedFile === file.name
                            ? 'bg-accent/15 border-l-2 border-l-accent'
                            : 'bg-transparent hover:bg-muted/20 border-l-2 border-l-transparent'
                            } ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-xs font-mono text-foreground">
                                    {String(index + 1).padStart(2, '0')}. {file.label}
                                </p>
                            </div>
                            {selectedFile === file.name && (
                                <div className="w-1 h-1 bg-accent ml-2" />
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
