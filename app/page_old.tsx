'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import AlgorithmSelector from './components/AlgorithmSelector';
import SampleFileSelector from './components/SampleFileSelector';
import Visualizer from './components/Visualizer';

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'closest-pair' | 'integer-mult' | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'samples'>('samples');

  const handleFileUpload = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-6 max-w-[1800px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-tight text-foreground mb-1">
                Algorithm Visualizer
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Divide and Conquer Analysis Tool
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-accent shadow-sm shadow-accent"></div>
              <span className="text-xs font-mono text-muted-foreground">DAA · 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-[1800px]">
        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Algorithm Selection */}
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
            />

            {/* File Input Area with Tabs */}
            <div>
              {/* Tab Selector */}
              <div className="flex space-x-1 mb-3">
                <button
                  onClick={() => setActiveTab('samples')}
                  className={`flex-1 px-3 py-2 text-xs font-mono transition-all rounded ${activeTab === 'samples'
                    ? 'bg-accent/15 text-accent border border-accent'
                    : 'bg-card/50 text-muted-foreground hover:text-foreground border border-border hover:border-emerald-subtle'
                    }`}
                >
                  Samples
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-3 py-2 text-xs font-mono transition-all rounded ${activeTab === 'upload'
                    ? 'bg-accent/15 text-accent border border-accent'
                    : 'bg-card/50 text-muted-foreground hover:text-foreground border border-border hover:border-emerald-subtle'
                    }`}
                >
                  Upload
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'samples' ? (
                <SampleFileSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onFileSelect={handleFileUpload}
                />
              ) : (
                <FileUpload
                  onFileUpload={handleFileUpload}
                  selectedAlgorithm={selectedAlgorithm}
                  fileName={fileName}
                />
              )}
            </div>
          </div>

          {/* Main Visualization Area */}
          <div className="col-span-12 lg:col-span-9">

            {selectedAlgorithm && fileContent ? (
              <Visualizer
                algorithm={selectedAlgorithm}
                fileContent={fileContent}
                fileName={fileName}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            ) : (
              <div className="rounded border border-border bg-card/30 h-[calc(100vh-12rem)] flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded border border-border bg-muted/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">Select algorithm and input file to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
