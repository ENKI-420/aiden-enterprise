'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Material data with scientific properties
const MATERIALS_DATA = {
  limestone: {
    name: "Limestone",
    composition: "Calcium Carbonate (CaCO₃)",
    density: "2.7 g/cm³",
    hardness: "3-4 (Mohs)",
    color: "#D2B48C",
    properties: [
      "Acoustic resonance characteristics",
      "Piezoelectric properties under stress",
      "Excellent sound transmission",
      "Thermal stability",
      "Weather resistance"
    ],
    weaponRelevance: [
      "Acoustic amplification in chambers",
      "Sound wave focusing and reflection",
      "Resonance frequency matching",
      "Energy wave propagation medium"
    ],
    scientificNotes: [
      "Limestone exhibits piezoelectric properties when subjected to mechanical stress",
      "Acoustic impedance matches air, allowing efficient sound transmission",
      "Crystalline structure enables precise frequency resonance",
      "Thermal expansion coefficient supports dimensional stability"
    ]
  },
  granite: {
    name: "Granite",
    composition: "Quartz, Feldspar, Mica",
    density: "2.7-2.8 g/cm³",
    hardness: "6-7 (Mohs)",
    color: "#696969",
    properties: [
      "High compressive strength",
      "Piezoelectric quartz content",
      "Electromagnetic shielding",
      "Thermal conductivity",
      "Dimensional stability"
    ],
    weaponRelevance: [
      "Primary energy resonator in King's Chamber",
      "Piezoelectric energy generation",
      "Electromagnetic field containment",
      "Thermal energy management"
    ],
    scientificNotes: [
      "Quartz crystals generate electrical charge under mechanical stress",
      "Natural electromagnetic shielding properties",
      "High thermal mass for energy storage",
      "Crystalline structure enables precise frequency control"
    ]
  },
  basalt: {
    name: "Basalt",
    composition: "Plagioclase, Pyroxene, Olivine",
    density: "2.9-3.1 g/cm³",
    hardness: "5-6 (Mohs)",
    color: "#2F4F4F",
    properties: [
      "High density and strength",
      "Magnetic properties",
      "Thermal insulation",
      "Chemical resistance",
      "Electromagnetic absorption"
    ],
    weaponRelevance: [
      "Energy grounding and storage",
      "Magnetic field manipulation",
      "Thermal energy containment",
      "Electromagnetic shielding"
    ],
    scientificNotes: [
      "Contains ferromagnetic minerals enabling magnetic field interaction",
      "High density provides excellent energy storage capacity",
      "Thermal properties support energy management systems",
      "Chemical stability ensures long-term structural integrity"
    ]
  },
  crystal: {
    name: "Crystalline Resonators",
    composition: "Quartz, Calcite, Apatite",
    density: "2.6-2.9 g/cm³",
    hardness: "7-8 (Mohs)",
    color: "#E6E6FA",
    properties: [
      "Piezoelectric resonance",
      "Frequency stability",
      "Energy amplification",
      "Coherent wave generation",
      "Harmonic oscillation"
    ],
    weaponRelevance: [
      "Primary energy amplification",
      "Frequency synchronization",
      "Coherent beam generation",
      "Resonance cascade effects"
    ],
    scientificNotes: [
      "Natural quartz crystals exhibit perfect piezoelectric properties",
      "Resonance frequencies can be precisely controlled",
      "Energy amplification through harmonic resonance",
      "Coherent wave generation enables focused energy projection"
    ]
  }
};

// Material analysis component
const MaterialAnalysis = ({ material, isActive }: { material: keyof typeof MATERIALS_DATA; isActive: boolean }) => {
  const data = MATERIALS_DATA[material];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0.3, y: isActive ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl p-6 border ${
        isActive ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' : 'border-slate-600/50'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Material color indicator */}
        <div
          className="w-16 h-16 rounded-lg border-2 border-slate-600/50"
          style={{ backgroundColor: data.color }}
        />

        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-300 mb-2">{data.name}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Composition</h4>
              <p className="text-slate-300 text-sm">{data.composition}</p>
            </div>

            <div>
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Physical Properties</h4>
              <div className="text-slate-300 text-sm space-y-1">
                <div>Density: {data.density}</div>
                <div>Hardness: {data.hardness}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Material Properties</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                {data.properties.map((prop, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Weapon Relevance</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                {data.weaponRelevance.map((relevance, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">⚡</span>
                    <span>{relevance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-600/50">
            <h4 className="text-amber-400 font-semibold text-sm mb-2">Scientific Analysis</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              {data.scientificNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🔬</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Engineering analysis component
const EngineeringAnalysis = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<keyof typeof MATERIALS_DATA>('limestone');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const engineeringInsights = {
    structural: [
      "Precision-cut blocks with tolerances of ±0.1mm",
      "Interlocking geometry prevents structural failure",
      "Load distribution optimized for energy transmission",
      "Thermal expansion joints accommodate temperature changes"
    ],
    acoustic: [
      "Chamber dimensions create specific resonance frequencies",
      "Material selection optimizes sound wave propagation",
      "Geometric shapes focus acoustic energy",
      "Multi-chamber system creates harmonic amplification"
    ],
    electromagnetic: [
      "Granite chambers act as electromagnetic cavities",
      "Crystal resonators generate coherent electromagnetic fields",
      "Material properties enable energy storage and release",
      "Geometric alignment focuses electromagnetic energy"
    ],
    thermal: [
      "High thermal mass materials store energy efficiently",
      "Thermal gradients create energy flow patterns",
      "Material properties enable heat-to-energy conversion",
      "Thermal expansion drives mechanical energy generation"
    ]
  };

  return (
    <div className="w-full space-y-6">
      {/* Material Selection */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
        <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
          Materials Analysis
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(MATERIALS_DATA).map(([key, material]) => (
            <button
              key={key}
              onClick={() => setSelectedMaterial(key as keyof typeof MATERIALS_DATA)}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                selectedMaterial === key
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div
                className="w-8 h-8 rounded mb-2 mx-auto"
                style={{ backgroundColor: material.color }}
              />
              <div className="text-xs font-medium">{material.name}</div>
            </button>
          ))}
        </div>

        <MaterialAnalysis material={selectedMaterial} isActive={true} />
      </div>

      {/* Engineering Analysis */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
            Engineering Analysis
          </h2>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(engineeringInsights).map(([category, insights]) => (
            <div key={category} className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-amber-300 mb-3 capitalize">
                {category} Engineering
              </h3>

              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: showAdvanced ? 1 : 0.5, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2 text-slate-300 text-sm"
                  >
                    <span className="text-amber-400 mt-1">⚙️</span>
                    <span>{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Advanced Physics Analysis */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 pt-6 border-t border-slate-600/50"
          >
            <h3 className="text-xl font-bold text-amber-200 mb-4">Advanced Physics Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-amber-300 font-semibold mb-2">Resonance Physics</h4>
                <div className="text-slate-300 text-sm space-y-2">
                  <div>• Natural frequency: 432 Hz (King's Chamber)</div>
                  <div>• Harmonic amplification: 8x energy gain</div>
                  <div>• Phase coherence: 99.9% synchronization</div>
                  <div>• Q-factor: 10,000+ (ultra-high quality)</div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-amber-300 font-semibold mb-2">Energy Conversion</h4>
                <div className="text-slate-300 text-sm space-y-2">
                  <div>• Piezoelectric efficiency: 85%</div>
                  <div>• Thermal-to-electrical: 40%</div>
                  <div>• Acoustic-to-electrical: 60%</div>
                  <div>• Overall system efficiency: 72%</div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-amber-300 font-semibold mb-2">Beam Formation</h4>
                <div className="text-slate-300 text-sm space-y-2">
                  <div>• Beam divergence: 0.001° (ultra-tight)</div>
                  <div>• Energy density: 1 GW/m²</div>
                  <div>• Coherence length: 1000 km</div>
                  <div>• Pulse duration: 1-1000 μs</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Materials Interaction Matrix */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
        <h2 className="text-2xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
          Materials Interaction Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600/50">
                <th className="text-left p-3 text-amber-300">Material</th>
                <th className="text-left p-3 text-amber-300">Limestone</th>
                <th className="text-left p-3 text-amber-300">Granite</th>
                <th className="text-left p-3 text-amber-300">Basalt</th>
                <th className="text-left p-3 text-amber-300">Crystal</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MATERIALS_DATA).map(([key, material]) => (
                <tr key={key} className="border-b border-slate-700/30">
                  <td className="p-3 font-medium text-slate-300">{material.name}</td>
                  <td className="p-3 text-slate-400">
                    {key === 'limestone' ? '—' : 'Acoustic coupling'}
                  </td>
                  <td className="p-3 text-slate-400">
                    {key === 'granite' ? '—' : 'Energy transfer'}
                  </td>
                  <td className="p-3 text-slate-400">
                    {key === 'basalt' ? '—' : 'Grounding'}
                  </td>
                  <td className="p-3 text-slate-400">
                    {key === 'crystal' ? '—' : 'Resonance'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EngineeringAnalysis;