'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type SceneMode = 'geometric' | 'acoustic' | 'electromagnetic' | 'quantum';

interface TelemetryDashboardProps {
  mode: SceneMode;
}

interface Measurement {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export default function TelemetryDashboard({ mode }: TelemetryDashboardProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      name: "Piezoelectric Output",
      value: 250,
      unit: "mV p-p",
      min: 0,
      max: 500,
      status: 'normal',
      trend: 'up'
    },
    {
      name: "DC Bias",
      value: 1.11,
      unit: "V",
      min: 1.09,
      max: 1.13,
      status: 'normal',
      trend: 'stable'
    },
    {
      name: "Q-Factor",
      value: 142,
      unit: "",
      min: 100,
      max: 200,
      status: 'normal',
      trend: 'up'
    },
    {
      name: "E-Field Strength",
      value: 55,
      unit: "mV/m",
      min: 0,
      max: 100,
      status: 'normal',
      trend: 'stable'
    },
    {
      name: "Magnetic Flux",
      value: 18,
      unit: "nT",
      min: -50,
      max: 50,
      status: 'normal',
      trend: 'down'
    },
    {
      name: "Scalar Intensity",
      value: 0.87,
      unit: "a.u.",
      min: 0,
      max: 1,
      status: 'normal',
      trend: 'up'
    }
  ]);

  const [timeData, setTimeData] = useState<{ time: string; value: number }[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMeasurements(prev => prev.map(measurement => {
        // Simulate realistic variations
        const variation = (Math.random() - 0.5) * 0.05;
        const newValue = measurement.value * (1 + variation);

        // Determine trend
        const trend = newValue > measurement.value ? 'up' :
                     newValue < measurement.value ? 'down' : 'stable';

        // Determine status based on thresholds
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (newValue > measurement.max * 0.9 || newValue < measurement.min * 1.1) {
          status = 'warning';
        }
        if (newValue > measurement.max || newValue < measurement.min) {
          status = 'critical';
        }

        return {
          ...measurement,
          value: Number(newValue.toFixed(2)),
          trend,
          status
        };
      }));

      // Update time series data
      setTimeData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          value: Math.random() * 100
        }];
        return newData.slice(-10); // Keep last 10 points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-blue-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getModeSpecificMeasurements = () => {
    switch (mode) {
      case 'acoustic':
        return measurements.filter(m => ['Piezoelectric Output', 'Q-Factor', 'Scalar Intensity'].includes(m.name));
      case 'electromagnetic':
        return measurements.filter(m => ['E-Field Strength', 'Magnetic Flux', 'DC Bias'].includes(m.name));
      case 'quantum':
        return measurements.filter(m => ['Scalar Intensity', 'Q-Factor', 'Magnetic Flux'].includes(m.name));
      default:
        return measurements;
    }
  };

  const modeSpecificMeasurements = getModeSpecificMeasurements();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#ffe066]">Telemetry Dashboard</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-200">Live Data</span>
        </div>
      </div>

      {/* Real-time Measurements */}
      <div className="space-y-3">
        {modeSpecificMeasurements.map((measurement, index) => (
          <motion.div
            key={measurement.name}
            className="bg-slate-800/50 rounded-lg p-3 border border-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-blue-200">{measurement.name}</h4>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${getStatusColor(measurement.status)}`}>
                  {measurement.status.toUpperCase()}
                </span>
                <span className="text-xs text-[#ffe066]">{getTrendIcon(measurement.trend)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-mono text-[#ffe066]">
                {measurement.value} {measurement.unit}
              </div>
              <div className="text-xs text-blue-100">
                {measurement.min}-{measurement.max}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full ${
                  measurement.status === 'critical' ? 'bg-red-500' :
                  measurement.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: `${((measurement.value - measurement.min) / (measurement.max - measurement.min)) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Time Series Chart */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-600">
        <h4 className="text-sm font-semibold text-[#ffe066] mb-3">Real-time Trend</h4>
        <div className="h-20 flex items-end justify-between gap-1">
          {timeData.map((point, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-t from-blue-500 to-[#ffe066] rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${point.value}%` }}
              transition={{ duration: 0.3 }}
              style={{ width: `${100 / timeData.length}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-blue-100 mt-2">
          <span>{timeData[0]?.time || '--:--:--'}</span>
          <span>{timeData[timeData.length - 1]?.time || '--:--:--'}</span>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-green-600">
        <h4 className="text-sm font-semibold text-green-400 mb-2">System Status</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-blue-100">Data Rate:</span>
            <span className="text-[#ffe066] font-mono">1 Hz</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Latency:</span>
            <span className="text-[#ffe066] font-mono">&lt;50ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Uptime:</span>
            <span className="text-[#ffe066] font-mono">99.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-100">Samples:</span>
            <span className="text-[#ffe066] font-mono">{timeData.length}</span>
          </div>
        </div>
      </div>

      {/* Mode-specific Alerts */}
      <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-600">
        <h4 className="text-sm font-semibold text-[#ffe066] mb-2">Mode Alerts</h4>
        <div className="text-xs text-blue-100 space-y-1">
          {mode === 'acoustic' && (
            <>
              <div className="flex justify-between">
                <span>Standing Wave:</span>
                <span className="text-green-400">Stable ✓</span>
              </div>
              <div className="flex justify-between">
                <span>Harmonic Lock:</span>
                <span className="text-green-400">94 Hz ✓</span>
              </div>
            </>
          )}
          {mode === 'electromagnetic' && (
            <>
              <div className="flex justify-between">
                <span>Phase Conjugation:</span>
                <span className="text-green-400">Active ✓</span>
              </div>
              <div className="flex justify-between">
                <span>Field Alignment:</span>
                <span className="text-green-400">Optimal ✓</span>
              </div>
            </>
          )}
          {mode === 'quantum' && (
            <>
              <div className="flex justify-between">
                <span>Entanglement:</span>
                <span className="text-green-400">Coherent ✓</span>
              </div>
              <div className="flex justify-between">
                <span>Superposition:</span>
                <span className="text-green-400">Maintained ✓</span>
              </div>
            </>
          )}
          {mode === 'geometric' && (
            <>
              <div className="flex justify-between">
                <span>Tetrahedral Symmetry:</span>
                <span className="text-green-400">Preserved ✓</span>
              </div>
              <div className="flex justify-between">
                <span>Geometric Resonance:</span>
                <span className="text-green-400">Optimal ✓</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}