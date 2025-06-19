'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ComponentData {
  name: string;
  status: 'validated' | 'pending' | 'failed';
  frequency: string;
  qFactor: number;
  material: string;
  dimensions: string;
  lastTested: string;
  notes: string;
}

interface FrequencyData {
  frequency: number;
  amplitude: number;
  phase: number;
  harmonic: number;
  timestamp: string;
}

export default function DataDashboardPage() {
  const [activeTab, setActiveTab] = useState('components');
  const [components, setComponents] = useState<ComponentData[]>([
    {
      name: "King's Chamber",
      status: 'validated',
      frequency: "94 Hz",
      qFactor: 142,
      material: "Granite",
      dimensions: "5.2m × 2.6m × 10.5m",
      lastTested: "2024-01-15 14:30",
      notes: "Primary resonator - optimal performance"
    },
    {
      name: "Queen's Chamber",
      status: 'validated',
      frequency: "188 Hz",
      qFactor: 89,
      material: "Limestone",
      dimensions: "4.6m × 2.3m × 5.2m",
      lastTested: "2024-01-15 14:25",
      notes: "Electrochemical node - stable operation"
    },
    {
      name: "Grand Gallery",
      status: 'validated',
      frequency: "376 Hz",
      qFactor: 67,
      material: "Limestone",
      dimensions: "2.1m × 8.6m × 47m",
      lastTested: "2024-01-15 14:20",
      notes: "Acoustic accelerator - efficient coupling"
    },
    {
      name: "Grotto",
      status: 'pending',
      frequency: "752 Hz",
      qFactor: 45,
      material: "Natural rock",
      dimensions: "2m × 2m × 2m",
      lastTested: "2024-01-15 14:15",
      notes: "Helmholtz cavity - testing in progress"
    }
  ]);

  const [frequencyData, setFrequencyData] = useState<FrequencyData[]>([
    { frequency: 94, amplitude: 1.0, phase: 0, harmonic: 1, timestamp: "14:30:00" },
    { frequency: 188, amplitude: 0.8, phase: 45, harmonic: 2, timestamp: "14:30:01" },
    { frequency: 376, amplitude: 0.6, phase: 90, harmonic: 4, timestamp: "14:30:02" },
    { frequency: 752, amplitude: 0.4, phase: 135, harmonic: 8, timestamp: "14:30:03" },
    { frequency: 1504, amplitude: 0.2, phase: 180, harmonic: 16, timestamp: "14:30:04" }
  ]);

  const [historicalData, setHistoricalData] = useState([
    { date: "2024-01-15", discovery: "Tetrahedral resonance confirmed", researcher: "Dr. Smith" },
    { date: "2024-01-14", discovery: "Scalar field detection", researcher: "Dr. Johnson" },
    { date: "2024-01-13", discovery: "Quantum entanglement mapping", researcher: "Dr. Williams" },
    { date: "2024-01-12", discovery: "Phase conjugation optimization", researcher: "Dr. Brown" },
    { date: "2024-01-11", discovery: "Acoustic standing wave validation", researcher: "Dr. Davis" }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-blue-200 bg-blue-200/10';
    }
  };

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    // Simulate data export
    console.log(`Exporting data in ${format} format`);
    alert(`Data exported successfully in ${format.toUpperCase()} format`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-blue-950 text-[#ffe066] p-6">
      {/* Header */}
      <motion.header
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Link href="/project-spectra" className="text-blue-200 hover:text-[#ffe066] transition-colors mb-2 inline-block">
              ← Back to Project Spectra
            </Link>
            <h1 className="text-3xl font-bold text-[#ffe066]">Research Data Dashboard</h1>
            <p className="text-blue-100 mt-2">Comprehensive analysis and validation of Project Spectra components</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => exportData('json')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              📄 Export JSON
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              📋 Export PDF
            </button>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <motion.div
        className="max-w-7xl mx-auto mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex gap-2 border-b border-blue-700">
          {[
            { id: 'components', label: 'Component Validation', icon: '🔬' },
            { id: 'frequency', label: 'Frequency Analysis', icon: '📈' },
            { id: 'timeline', label: 'Historical Timeline', icon: '📅' },
            { id: 'export', label: 'Export Tools', icon: '📤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ffe066] text-black'
                  : 'bg-slate-800/50 text-blue-200 hover:bg-slate-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Component Validation Table */}
        {activeTab === 'components' && (
          <div className="bg-slate-900/80 rounded-xl p-6 border border-blue-700 shadow-lg">
            <h2 className="text-2xl font-bold text-[#ffe066] mb-6">Component Validation Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-700">
                    <th className="text-left py-3 px-4 text-blue-200">Component</th>
                    <th className="text-left py-3 px-4 text-blue-200">Status</th>
                    <th className="text-left py-3 px-4 text-blue-200">Frequency</th>
                    <th className="text-left py-3 px-4 text-blue-200">Q-Factor</th>
                    <th className="text-left py-3 px-4 text-blue-200">Material</th>
                    <th className="text-left py-3 px-4 text-blue-200">Dimensions</th>
                    <th className="text-left py-3 px-4 text-blue-200">Last Tested</th>
                    <th className="text-left py-3 px-4 text-blue-200">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component, index) => (
                    <motion.tr
                      key={component.name}
                      className="border-b border-blue-700/50 hover:bg-slate-800/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-3 px-4 font-semibold text-blue-200">{component.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(component.status)}`}>
                          {component.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#ffe066]">{component.frequency}</td>
                      <td className="py-3 px-4 font-mono text-[#ffe066]">{component.qFactor}</td>
                      <td className="py-3 px-4 text-blue-100">{component.material}</td>
                      <td className="py-3 px-4 text-blue-100">{component.dimensions}</td>
                      <td className="py-3 px-4 text-blue-100">{component.lastTested}</td>
                      <td className="py-3 px-4 text-blue-100">{component.notes}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Frequency Spectrum Analysis */}
        {activeTab === 'frequency' && (
          <div className="bg-slate-900/80 rounded-xl p-6 border border-blue-700 shadow-lg">
            <h2 className="text-2xl font-bold text-[#ffe066] mb-6">Frequency Spectrum Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Frequency Chart */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-600">
                <h3 className="text-lg font-semibold text-blue-200 mb-4">Harmonic Series</h3>
                <div className="space-y-3">
                  {frequencyData.map((data, index) => (
                    <motion.div
                      key={data.frequency}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-16 text-sm font-mono text-[#ffe066]">{data.frequency} Hz</div>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-[#ffe066] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${data.amplitude * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="w-12 text-xs text-blue-100">{data.amplitude.toFixed(1)}</div>
                      <div className="w-12 text-xs text-blue-100">{data.phase}°</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Frequency Statistics */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-600">
                <h3 className="text-lg font-semibold text-blue-200 mb-4">Frequency Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Fundamental Frequency:</span>
                    <span className="text-[#ffe066] font-mono">94 Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Harmonic Range:</span>
                    <span className="text-[#ffe066] font-mono">1-16</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Bandwidth:</span>
                    <span className="text-[#ffe066] font-mono">1.41 kHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Q-Factor Average:</span>
                    <span className="text-[#ffe066] font-mono">85.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Phase Coherence:</span>
                    <span className="text-[#ffe066] font-mono">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historical Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-slate-900/80 rounded-xl p-6 border border-blue-700 shadow-lg">
            <h2 className="text-2xl font-bold text-[#ffe066] mb-6">Historical Timeline of Discoveries</h2>
            <div className="space-y-4">
              {historicalData.map((item, index) => (
                <motion.div
                  key={item.date}
                  className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-blue-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-24 text-sm font-mono text-[#ffe066]">{item.date}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-200">{item.discovery}</h3>
                    <p className="text-sm text-blue-100">Researcher: {item.researcher}</p>
                  </div>
                  <div className="w-2 h-2 bg-[#ffe066] rounded-full mt-2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Export Tools */}
        {activeTab === 'export' && (
          <div className="bg-slate-900/80 rounded-xl p-6 border border-blue-700 shadow-lg">
            <h2 className="text-2xl font-bold text-[#ffe066] mb-6">Export Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Data Export Options</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => exportData('csv')}
                    className="w-full p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors text-left"
                  >
                    <div className="font-semibold">📊 CSV Export</div>
                    <div className="text-sm opacity-80">Component validation data and measurements</div>
                  </button>
                  <button
                    onClick={() => exportData('json')}
                    className="w-full p-4 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-left"
                  >
                    <div className="font-semibold">📄 JSON Export</div>
                    <div className="text-sm opacity-80">Structured data for API integration</div>
                  </button>
                  <button
                    onClick={() => exportData('pdf')}
                    className="w-full p-4 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors text-left"
                  >
                    <div className="font-semibold">📋 PDF Report</div>
                    <div className="text-sm opacity-80">Comprehensive research report</div>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Export Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Total Components:</span>
                    <span className="text-[#ffe066] font-mono">{components.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Frequency Points:</span>
                    <span className="text-[#ffe066] font-mono">{frequencyData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Timeline Events:</span>
                    <span className="text-[#ffe066] font-mono">{historicalData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Last Export:</span>
                    <span className="text-[#ffe066] font-mono">2024-01-15 15:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}