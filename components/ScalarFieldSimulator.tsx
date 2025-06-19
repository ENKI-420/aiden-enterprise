'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface ScalarFieldSimulatorProps {
  isActive: boolean;
}

interface Sideband {
  frequency: number;
  amplitude: number;
  phase: number;
  type: 'upper' | 'lower';
}

export default function ScalarFieldSimulator({ isActive }: ScalarFieldSimulatorProps) {
  const fieldRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  const [selectedSideband, setSelectedSideband] = useState<Sideband | null>(null);
  const [scalarIntensity, setScalarIntensity] = useState(0.87);

  // Sideband data
  const sidebands = useMemo<Sideband[]>(() => [
    { frequency: 94000, amplitude: 0.8, phase: 0, type: 'upper' },
    { frequency: 93988, amplitude: 0.6, phase: 45, type: 'lower' },
    { frequency: 94012, amplitude: 0.7, phase: 90, type: 'upper' },
    { frequency: 93976, amplitude: 0.5, phase: 135, type: 'lower' }
  ], []);

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    if (fieldRef.current && isActive) {
      // Scalar field pulsation
      const intensity = 0.5 + Math.sin(time * 2) * 0.3;
      setScalarIntensity(intensity);
    }
  });

  // Phase-conjugate feedback loop visualization
  const feedbackLoop = useMemo(() => {
    const points = [];
    const radius = 2;
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      points.push(new THREE.Vector3(x, 0, z));
    }

    return points;
  }, []);

  return (
    <group>
      {/* Phase-conjugate feedback loop */}
      <group ref={fieldRef} position={[0, 0, 0]}>
        {isActive && (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={feedbackLoop.length}
                array={new Float32Array(feedbackLoop.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#4169E1"
              transparent
              opacity={0.8}
              linewidth={3}
            />
          </line>
        )}

        {/* Feedback nodes */}
        {[0, 1, 2, 3].map((node, index) => {
          const angle = (index / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 2;
          const z = Math.sin(angle) * 2;

          return (
            <group key={node} position={[x, 0, z]}>
              <mesh>
                <sphereGeometry args={[0.2, 8, 6]} />
                <meshStandardMaterial
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={isActive ? 0.5 + Math.sin(time * 3 + index) * 0.3 : 0.2}
                />
              </mesh>

              {/* Node labels */}
              <Text
                position={[0, 0.4, 0]}
                fontSize={0.15}
                color="#ffe066"
                anchorX="center"
                anchorY="middle"
              >
                N{index + 1}
              </Text>
            </group>
          );
        })}

        {/* Energy flow pathways */}
        {isActive && (
          <group>
            {[0, 1, 2, 3].map((path, index) => {
              const startAngle = (index / 4) * Math.PI * 2;
              const endAngle = ((index + 1) / 4) * Math.PI * 2;
              const startX = Math.cos(startAngle) * 2;
              const startZ = Math.sin(startAngle) * 2;
              const endX = Math.cos(endAngle) * 2;
              const endZ = Math.sin(endAngle) * 2;

              return (
                <mesh key={`path-${index}`}>
                  <cylinderGeometry args={[0.02, 0.02, 2]} />
                  <meshStandardMaterial
                    color="#32CD32"
                    transparent
                    opacity={0.6}
                    emissive="#32CD32"
                    emissiveIntensity={0.3 + Math.sin(time * 2 + index) * 0.2}
                  />
                </mesh>
              );
            })}
          </group>
        )}
      </group>

      {/* Sideband visualization */}
      <group position={[4, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Sideband Spectrum
        </Text>

        {sidebands.map((sideband, index) => (
          <group key={sideband.frequency} position={[0, 1.5 - index * 0.6, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.12}
              color={sideband.type === 'upper' ? "#FF4500" : "#4169E1"}
              anchorX="left"
              anchorY="middle"
            >
              {sideband.frequency} Hz ({sideband.type})
            </Text>

            {/* Sideband amplitude bar */}
            <mesh position={[1.5, 0, 0]}>
              <boxGeometry args={[sideband.amplitude * 0.5, 0.1, 0.1]} />
              <meshStandardMaterial
                color={sideband.type === 'upper' ? "#FF4500" : "#4169E1"}
                emissive={sideband.type === 'upper' ? "#FF4500" : "#4169E1"}
                emissiveIntensity={0.3 + Math.sin(time * 4 + index) * 0.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Apex emission node */}
      <group position={[0, 3, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 12]} />
          <meshStandardMaterial
            color="#FF4500"
            emissive="#FF4500"
            emissiveIntensity={isActive ? 0.8 + Math.sin(time * 4) * 0.4 : 0.3}
          />
        </mesh>

        {/* Emission field */}
        {isActive && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 12]} />
            <meshStandardMaterial
              color="#FF4500"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        )}

        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="#FF4500"
          anchorX="center"
          anchorY="middle"
        >
          Apex Emission
        </Text>
      </group>

      {/* Energy flow through shafts */}
      <group position={[-4, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Energy Flow
        </Text>

        {/* Shaft visualization */}
        {[0, 1, 2, 3].map((shaft, index) => (
          <group key={shaft} position={[0, 1.5 - index * 0.6, 0]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 2]} />
              <meshStandardMaterial
                color="#32CD32"
                transparent
                opacity={0.6}
                emissive="#32CD32"
                emissiveIntensity={isActive ? 0.4 + Math.sin(time * 2 + index) * 0.2 : 0.1}
              />
            </mesh>

            <Text
              position={[0.3, 0, 0]}
              fontSize={0.1}
              color="#32CD32"
              anchorX="left"
              anchorY="middle"
            >
              Shaft {index + 1}
            </Text>
          </group>
        ))}
      </group>

      {/* Real-time scalar intensity measurement */}
      {isActive && (
        <Html position={[0, -2, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-700 shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-[#ffe066] mb-2">Scalar Field Measurements</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Scalar Intensity:</span>
                <span className="text-[#ffe066] font-mono">{(scalarIntensity * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Phase Conjugation:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Feedback Loop:</span>
                <span className="text-green-400">Stable</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Sideband Count:</span>
                <span className="text-[#ffe066] font-mono">{sidebands.length}</span>
              </div>
            </div>

            {/* Intensity meter */}
            <div className="mt-3">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-[#ffe066] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scalarIntensity * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Sideband details panel */}
      {selectedSideband && (
        <Html position={[6, 0, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-700 shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-[#ffe066] mb-2">Sideband Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Frequency:</span>
                <span className="text-[#ffe066] font-mono">{selectedSideband.frequency} Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Amplitude:</span>
                <span className="text-[#ffe066] font-mono">{selectedSideband.amplitude.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Phase:</span>
                <span className="text-[#ffe066] font-mono">{selectedSideband.phase}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Type:</span>
                <span className={`font-mono ${selectedSideband.type === 'upper' ? 'text-red-400' : 'text-blue-400'}`}>
                  {selectedSideband.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSideband(null)}
              className="mt-3 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}