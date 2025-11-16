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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Terminal-Style Header */}
      <div className="border-b border-border">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <span className="text-xs font-mono text-muted-foreground">~/algorithm-visualizer</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xs font-mono text-muted-foreground">DAA Terminal v2.0</span>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              <span className="text-xs font-mono text-accent">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Command Center */}
        <div className="w-80 border-r border-border flex flex-col bg-card/20">
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-accent uppercase tracking-wider">Command Center</span>
              <div className="w-1 h-1 rounded-full bg-cyan-glow"></div>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Configure analysis parameters</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {/* Algorithm Selection */}
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-1 h-1 bg-accent"></div>
                <span className="text-xs font-mono text-muted-foreground uppercase">Algorithm</span>
              </div>
              <AlgorithmSelector
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={setSelectedAlgorithm}
              />
            </div>

            {/* Input Source */}
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-1 h-1 bg-accent"></div>
                <span className="text-xs font-mono text-muted-foreground uppercase">Input Source</span>
              </div>
              <div className="flex space-x-1 mb-3">
                <button
                  onClick={() => setActiveTab('samples')}
                  className={`flex-1 px-2 py-1.5 text-xs font-mono transition-all ${activeTab === 'samples'
                    ? 'bg-accent/20 text-accent border border-accent/50'
                    : 'bg-muted/20 text-muted-foreground hover:text-foreground border border-border'
                    }`}
                >
                  SAMPLES
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-2 py-1.5 text-xs font-mono transition-all ${activeTab === 'upload'
                    ? 'bg-accent/20 text-accent border border-accent/50'
                    : 'bg-muted/20 text-muted-foreground hover:text-foreground border border-border'
                    }`}
                >
                  UPLOAD
                </button>
              </div>
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

          {/* Panel Footer */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Status</span>
              <span className="text-accent">{selectedAlgorithm && fileContent ? 'READY' : 'STANDBY'}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Visualization */}
        <div className="flex-1 flex flex-col">
          {/* Visualization Header */}
          <div className="px-6 py-3 border-b border-border bg-card/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-accent uppercase tracking-wider">Analysis Output</span>
                {fileName && (
                  <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted/20 border border-border">
                    {fileName}
                  </span>
                )}
              </div>
              {selectedAlgorithm && (
                <span className="text-xs font-mono text-teal-bright">
                  {selectedAlgorithm === 'closest-pair' ? 'CLOSEST_PAIR' : 'KARATSUBA_MULT'}
                </span>
              )}
            </div>
          </div>

          {/* Visualization Content */}
          <div className="flex-1 overflow-auto p-6">
            {selectedAlgorithm && fileContent ? (
              <Visualizer
                algorithm={selectedAlgorithm}
                fileContent={fileContent}
                fileName={fileName}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 border border-border bg-card/20">
                    <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-mono text-foreground">AWAITING INPUT</p>
                    <p className="text-xs font-mono text-muted-foreground">Select algorithm and data source to initialize</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
