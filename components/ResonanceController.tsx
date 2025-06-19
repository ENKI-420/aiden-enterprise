'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type SceneMode = 'geometric' | 'acoustic' | 'electromagnetic' | 'quantum';

interface ResonanceControllerProps {
  mode: SceneMode;
}

interface Parameter {
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  description: string;
  isOptimizing: boolean;
}

export default function ResonanceController({ mode }: ResonanceControllerProps) {
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      name: "HCl Injection Rate",
      value: 3.2,
      min: 0,
      max: 10,
      unit: "mL/min",
      description: "Electrochemical cell pH control",
      isOptimizing: true
    },
    {
      name: "Transducer Amplitude",
      value: 75,
      min: 0,
      max: 100,
      unit: "mW",
      description: "Acoustic transducer power",
      isOptimizing: true
    },
    {
      name: "Resistor Load",
      value: 142,
      min: 0,
      max: 200,
      unit: "Ω",
      description: "Q-factor optimization",
      isOptimizing: false
    },
    {
      name: "Frequency Offset",
      value: 0,
      min: -10,
      max: 10,
      unit: "Hz",
      description: "Fine frequency tuning",
      isOptimizing: true
    }
  ]);

  const [aiStatus, setAiStatus] = useState({
    isActive: true,
    optimizationTarget: "scalarSidebandAmplitude",
    convergenceRate: 0.87,
    lastUpdate: new Date().toLocaleTimeString()
  });

  // Simulate AI optimization
  useEffect(() => {
    const interval = setInterval(() => {
      setParameters(prev => prev.map(param => {
        if (param.isOptimizing) {
          // Simulate AI-driven parameter adjustment
          const variation = (Math.random() - 0.5) * 0.1;
          const newValue = Math.max(param.min, Math.min(param.max, param.value + variation));
          return { ...param, value: Number(newValue.toFixed(2)) };
        }
        return param;
      }));

      setAiStatus(prev => ({
        ...prev,
        convergenceRate: Math.max(0.5, Math.min(1, prev.convergenceRate + (Math.random() - 0.5) * 0.02)),
        lastUpdate: new Date().toLocaleTimeString()
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleParameterChange = (index: number, value: number) => {
    setParameters(prev => prev.map((param, i) =>
      i === index ? { ...param, value, isOptimizing: false } : param
    ));
  };

  const toggleOptimization = (index: number) => {
    setParameters(prev => prev.map((param, i) =>
      i === index ? { ...param, isOptimizing: !param.isOptimizing } : param
    ));
  };

  const getModeSpecificParameters = () => {
    switch (mode) {
      case 'acoustic':
        return parameters.filter(p => ['Transducer Amplitude', 'Frequency Offset'].includes(p.name));
      case 'electromagnetic':
        return parameters.filter(p => ['Resistor Load', 'Transducer Amplitude'].includes(p.name));
      case 'quantum':
        return parameters.filter(p => ['Frequency Offset', 'Resistor Load'].includes(p.name));
      default:
        return parameters;
    }
  };

  const modeSpecificParams = getModeSpecificParameters();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#ffe066]">Resonance Controller</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${aiStatus.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-xs text-blue-200">AI Active</span>
        </div>
      </div>

      {/* AI Status */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-600">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-200">AI Optimization</span>
          <span className="text-xs text-green-400">{aiStatus.lastUpdate}</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-blue-100">Target:</span>
            <span className="text-[#ffe066] font-mono">{aiStatus.optimizationTarget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Convergence:</span>
            <span className="text-[#ffe066] font-mono">{(aiStatus.convergenceRate * 100).toFixed(1)}%</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-slate-700 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-[#ffe066] h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${aiStatus.convergenceRate * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-3">
        {modeSpecificParams.map((param, index) => (
          <motion.div
            key={param.name}
            className="bg-slate-800/50 rounded-lg p-3 border border-blue-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-blue-200">{param.name}</h4>
                <p className="text-xs text-blue-100">{param.description}</p>
              </div>
              <button
                onClick={() => toggleOptimization(index)}
                className={`px-2 py-1 rounded text-xs ${
                  param.isOptimizing
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-blue-200'
                }`}
              >
                {param.isOptimizing ? 'AI' : 'Manual'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={param.min}
                max={param.max}
                value={param.value}
                onChange={(e) => handleParameterChange(index, parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={param.isOptimizing}
                aria-label={`Adjust ${param.name}`}
                title={`Adjust ${param.name} from ${param.min} to ${param.max} ${param.unit}`}
              />
              <div className="text-right min-w-16">
                <div className="text-sm font-mono text-[#ffe066]">
                  {param.value} {param.unit}
                </div>
                <div className="text-xs text-blue-100">
                  {param.min}-{param.max}
                </div>
              </div>
            </div>

            {param.isOptimizing && (
              <motion.div
                className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-[#ffe066] rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Safety Alerts */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-green-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-semibold text-green-400">Safety Status</span>
        </div>
        <div className="text-xs text-blue-100 space-y-1">
          <div className="flex justify-between">
            <span>E-Field:</span>
            <span className="text-green-400">55 mV/m ✓</span>
          </div>
          <div className="flex justify-between">
            <span>Q-Factor:</span>
            <span className="text-green-400">142 ✓</span>
          </div>
          <div className="flex justify-between">
            <span>DC Bias:</span>
            <span className="text-green-400">1.11V ✓</span>
          </div>
        </div>
      </div>

      {/* Mode-specific Info */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-600">
        <h4 className="text-sm font-semibold text-[#ffe066] mb-2">Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</h4>
        <div className="text-xs text-blue-100">
          {mode === 'acoustic' && "Optimizing standing wave patterns and harmonic resonance"}
          {mode === 'electromagnetic' && "Tuning phase-conjugate feedback and field alignment"}
          {mode === 'quantum' && "Maximizing entanglement coherence and superposition states"}
          {mode === 'geometric' && "Maintaining tetrahedral symmetry and geometric resonance"}
        </div>
      </div>
    </div>
  );
}