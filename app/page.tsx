'use client';

import { useState, useEffect } from 'react';
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
  const [time, setTime] = useState(new Date());
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Top Status Bar */}
      <div className="h-10 flex items-center justify-between px-6" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: 'var(--accent-primary)' }}></div>
            <span className="text-xs font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="text-xs font-mono opacity-60">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs font-mono opacity-60">ANALYSIS ENGINE v3.2</div>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-3" style={{ background: 'var(--success)' }}></div>
            <div className="w-1 h-4" style={{ background: 'var(--success)' }}></div>
            <div className="w-1 h-2" style={{ background: 'var(--success)', opacity: 0.5 }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 flex gap-0">
        {/* Left Control Panel */}
        <div
          className="flex flex-col transition-all duration-300"
          style={{
            background: 'var(--panel)',
            borderRight: '1px solid var(--border)',
            width: isPanelCollapsed ? '48px' : '320px',
            minWidth: isPanelCollapsed ? '48px' : '320px'
          }}
        >
          {/* Control Header */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              {!isPanelCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'var(--panel-light)', border: '1px solid var(--border)' }}>
                    <div className="w-3 h-3" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}></div>
                  </div>
                  <span className="text-sm font-mono font-bold">CONTROL MATRIX</span>
                </div>
              )}
              <button
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                className="ml-auto p-1 transition-all hover:opacity-70"
                style={{ color: 'var(--accent-primary)' }}
                title={isPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    transform: isPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }}
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            </div>
            {!isPanelCollapsed && (
              <div className="h-px" style={{ background: 'linear-gradient(90deg, var(--accent-primary), transparent)' }}></div>
            )}
          </div>

          {/* Scrollable Content */}
          {isPanelCollapsed ? (
            <div className="flex-1 flex flex-col items-center py-6 space-y-6">
              {/* Collapsed Icons */}
              <button
                onClick={() => setSelectedAlgorithm('closest-pair')}
                className="w-8 h-8 flex items-center justify-center transition-all"
                style={{
                  background: selectedAlgorithm === 'closest-pair' ? 'var(--panel-light)' : 'transparent',
                  border: `1px solid ${selectedAlgorithm === 'closest-pair' ? 'var(--accent-primary)' : 'var(--border)'}`,
                }}
                title="Closest Pair"
              >
                <div className="w-2 h-2" style={{ background: 'var(--accent-primary)' }}></div>
              </button>
              <button
                onClick={() => setSelectedAlgorithm('integer-mult')}
                className="w-8 h-8 flex items-center justify-center transition-all"
                style={{
                  background: selectedAlgorithm === 'integer-mult' ? 'var(--panel-light)' : 'transparent',
                  border: `1px solid ${selectedAlgorithm === 'integer-mult' ? 'var(--accent-secondary)' : 'var(--border)'}`,
                }}
                title="Karatsuba"
              >
                <div className="w-2 h-2" style={{ background: 'var(--accent-secondary)' }}></div>
              </button>
              <div className="w-px h-8" style={{ background: 'var(--border)' }}></div>
              <div className="flex flex-col space-y-2">
                <div className={`w-2 h-2 ${selectedAlgorithm ? 'animate-pulse-glow' : ''}`} style={{ background: selectedAlgorithm ? 'var(--success)' : 'var(--border)' }} title="Algorithm"></div>
                <div className={`w-2 h-2 ${fileContent ? 'animate-pulse-glow' : ''}`} style={{ background: fileContent ? 'var(--success)' : 'var(--border)' }} title="Data"></div>
                <div className={`w-2 h-2 ${isProcessing ? 'animate-pulse-glow' : ''}`} style={{ background: isProcessing ? 'var(--accent-secondary)' : 'var(--border)' }} title="Processing"></div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Algorithm Module */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-1" style={{ background: 'var(--accent-primary)' }}></div>
                  <div className="w-1 h-1" style={{ background: 'var(--accent-secondary)' }}></div>
                  <span className="text-xs font-mono opacity-60 uppercase">Algorithm Module</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAlgorithm('closest-pair')}
                    className="w-full text-left p-3 transition-all group"
                    style={{
                      background: selectedAlgorithm === 'closest-pair' ? 'var(--panel-light)' : 'transparent',
                      border: `1px solid ${selectedAlgorithm === 'closest-pair' ? 'var(--accent-primary)' : 'var(--border)'}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedAlgorithm === 'closest-pair' && (
                      <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }}></div>
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold">CLOSEST PAIR</span>
                        <div className={`w-2 h-2 transition-opacity ${selectedAlgorithm === 'closest-pair' ? 'opacity-100' : 'opacity-30'}`} style={{ background: 'var(--accent-primary)' }}></div>
                      </div>
                      <div className="text-xs opacity-60 font-mono">Euclidean Space • O(n log n)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedAlgorithm('integer-mult')}
                    className="w-full text-left p-3 transition-all group"
                    style={{
                      background: selectedAlgorithm === 'integer-mult' ? 'var(--panel-light)' : 'transparent',
                      border: `1px solid ${selectedAlgorithm === 'integer-mult' ? 'var(--accent-secondary)' : 'var(--border)'}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedAlgorithm === 'integer-mult' && (
                      <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-secondary), transparent)' }}></div>
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold">KARATSUBA</span>
                        <div className={`w-2 h-2 transition-opacity ${selectedAlgorithm === 'integer-mult' ? 'opacity-100' : 'opacity-30'}`} style={{ background: 'var(--accent-secondary)' }}></div>
                      </div>
                      <div className="text-xs opacity-60 font-mono">Integer Mult • O(n^1.585)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Data Source Module */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-1 h-1" style={{ background: 'var(--accent-tertiary)' }}></div>
                  <div className="w-1 h-1" style={{ background: 'var(--warning)' }}></div>
                  <span className="text-xs font-mono opacity-60 uppercase">Data Source</span>
                </div>

                {/* Tab Switcher */}
                <div className="flex space-x-1 mb-3">
                  <button
                    onClick={() => setActiveTab('samples')}
                    className="flex-1 py-2 text-xs font-mono transition-all"
                    style={{
                      background: activeTab === 'samples' ? 'var(--panel-light)' : 'transparent',
                      borderBottom: `2px solid ${activeTab === 'samples' ? 'var(--accent-primary)' : 'transparent'}`,
                      opacity: activeTab === 'samples' ? 1 : 0.5
                    }}
                  >
                    LIBRARY
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="flex-1 py-2 text-xs font-mono transition-all"
                    style={{
                      background: activeTab === 'upload' ? 'var(--panel-light)' : 'transparent',
                      borderBottom: `2px solid ${activeTab === 'upload' ? 'var(--accent-primary)' : 'transparent'}`,
                      opacity: activeTab === 'upload' ? 1 : 0.5
                    }}
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

              {/* System Status */}
              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="opacity-60">Algorithm</span>
                    <span style={{ color: selectedAlgorithm ? 'var(--accent-primary)' : 'var(--warning)' }}>
                      {selectedAlgorithm ? selectedAlgorithm.toUpperCase() : 'NOT SET'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="opacity-60">Data Input</span>
                    <span style={{ color: fileContent ? 'var(--success)' : 'var(--warning)' }}>
                      {fileContent ? 'LOADED' : 'WAITING'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="opacity-60">Processing</span>
                    <span style={{ color: isProcessing ? 'var(--accent-secondary)' : 'var(--foreground)' }}>
                      {isProcessing ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col">
          {/* Viz Header */}
          <div className="h-14 flex items-center justify-between px-6" style={{ background: 'var(--panel-light)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
                  <svg className="w-5 h-5" style={{ stroke: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="square" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-mono font-bold">ANALYSIS VIEWPORT</div>
                  {fileName && <div className="text-xs font-mono opacity-60">{fileName}</div>}
                </div>
              </div>
            </div>
            {selectedAlgorithm && (
              <div className="flex items-center space-x-3">
                <div className="text-xs font-mono px-3 py-1" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
                  {selectedAlgorithm === 'closest-pair' ? 'GEOMETRIC ANALYSIS' : 'ARITHMETIC ANALYSIS'}
                </div>
                <div className="flex space-x-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-4" style={{ background: 'var(--border)', opacity: Math.random() }}></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visualization Content */}
          <div className="flex-1 overflow-auto" style={{ background: 'var(--background)' }}>
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
                <div className="text-center space-y-6">
                  {/* Animated Grid */}
                  <div className="w-32 h-32 relative mx-auto">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(var(--grid-line) 1px, transparent 1px),
                        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
                      `,
                      backgroundSize: '16px 16px'
                    }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 animate-pulse-glow" style={{
                          border: '2px solid var(--accent-primary)',
                          transform: 'rotate(45deg)'
                        }}></div>
                        <div className="absolute inset-2" style={{
                          border: '2px solid var(--accent-secondary)',
                          transform: 'rotate(45deg)'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-mono mb-2">AWAITING INITIALIZATION</div>
                    <div className="text-xs font-mono opacity-60">Configure parameters to begin analysis</div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2`} style={{ background: selectedAlgorithm ? 'var(--success)' : 'var(--warning)' }}></div>
                      <span className="text-xs font-mono opacity-60">ALGORITHM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2`} style={{ background: fileContent ? 'var(--success)' : 'var(--warning)' }}></div>
                      <span className="text-xs font-mono opacity-60">DATA</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
