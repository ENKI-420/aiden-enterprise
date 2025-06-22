'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

// Dynamically import 3D components to avoid SSR issues
const PyramidScene3D = dynamic(() => import('../../../components/PyramidScene3D'), { ssr: false });
const ResonanceController = dynamic(() => import('../../../components/ResonanceController'), { ssr: false });
const TelemetryDashboard = dynamic(() => import('../../../components/TelemetryDashboard'), { ssr: false });

type SceneMode = 'geometric' | 'acoustic' | 'electromagnetic' | 'quantum';

export default function ExplorePage() {
  const [activeMode, setActiveMode] = useState<SceneMode>('geometric');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for 3D components
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const sceneModes = [
    { id: 'geometric', label: 'Geometric', icon: '🔺', description: 'Tetrahedral physics and resonance mechanics' },
    { id: 'acoustic', label: 'Acoustic', icon: '🔊', description: 'Standing wave behavior and scalar impulse generation' },
    { id: 'electromagnetic', label: 'Electromagnetic', icon: '⚡', description: 'Phase-conjugate feedback loops' },
    { id: 'quantum', label: 'Quantum', icon: '🧬', description: 'Quantum entanglement mapping' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-blue-950 text-[#ffe066]">
      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-50 p-4 bg-slate-950/90 backdrop-blur-sm border-b border-blue-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/project-spectra" className="text-blue-200 hover:text-[#ffe066] transition-colors">
              ← Back to Project Spectra
            </Link>
            <h1 className="text-2xl font-bold text-[#ffe066]">Immersive Experience</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-200">AI Status: <span className="text-green-400">Active</span></span>
            <Link href="/project-spectra/data" className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm hover:bg-blue-600 transition-colors">
              📊 Data Dashboard
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Scene Selector */}
      <motion.div
        className="absolute top-20 left-0 right-0 z-40 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {sceneModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as SceneMode)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeMode === mode.id
                    ? 'bg-[#ffe066] text-black shadow-lg'
                    : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main 3D Canvas */}
      <div className="relative w-full h-screen">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 border-4 border-blue-700 border-t-[#ffe066] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-200 text-lg">Loading Immersive Experience...</p>
              <p className="text-blue-100 text-sm mt-2">Initializing 3D Pyramid Visualization</p>
            </motion.div>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 5, 10], fov: 60 }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <PyramidScene3D mode={activeMode} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxDistance={20}
                minDistance={3}
              />
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4169E1" />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Control Panel */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 z-40"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Resonance Controller */}
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-700 shadow-lg">
              <ResonanceController mode={activeMode} />
            </div>

            {/* Telemetry Dashboard */}
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-700 shadow-lg">
              <TelemetryDashboard mode={activeMode} />
            </div>

            {/* Info Panel */}
            <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-700 shadow-lg">
              <h3 className="text-lg font-bold text-[#ffe066] mb-3">Current Mode: {sceneModes.find(m => m.id === activeMode)?.label}</h3>
              <p className="text-sm text-blue-100 mb-4">
                {sceneModes.find(m => m.id === activeMode)?.description}
              </p>
              <div className="space-y-2 text-xs text-blue-200">
                <div className="flex justify-between">
                  <span>Chamber Status:</span>
                  <span className="text-green-400">Resonant</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Optimization:</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Thresholds:</span>
                  <span className="text-green-400">Within Limits</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Collection:</span>
                  <span className="text-green-400">Recording</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Educational Overlay */}
      <motion.div
        className="absolute top-32 right-4 z-40 max-w-sm"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-700 shadow-lg">
          <h3 className="text-lg font-bold text-[#ffe066] mb-2">Educational Guide</h3>
          <div className="text-sm text-blue-100 space-y-2">
            <p><strong>Click and Drag:</strong> Rotate the pyramid</p>
            <p><strong>Scroll:</strong> Zoom in/out</p>
            <p><strong>Right Click:</strong> Pan view</p>
            <p><strong>Chamber Selection:</strong> Click on colored chambers for details</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}