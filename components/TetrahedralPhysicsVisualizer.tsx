'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface TetrahedralPhysicsVisualizerProps {
  isActive: boolean;
}

interface PlanckConstant {
  name: string;
  symbol: string;
  value: string;
  unit: string;
  description: string;
}

const planckConstants: PlanckConstant[] = [
  {
    name: "Planck Constant",
    symbol: "h",
    value: "6.62607015",
    unit: "×10⁻³⁴ J⋅s",
    description: "Quantum of action"
  },
  {
    name: "Planck Length",
    symbol: "ℓₚ",
    value: "1.616255",
    unit: "×10⁻³⁵ m",
    description: "Smallest meaningful length"
  },
  {
    name: "Planck Time",
    symbol: "tₚ",
    value: "5.391247",
    unit: "×10⁻⁴⁴ s",
    description: "Smallest meaningful time"
  },
  {
    name: "Planck Mass",
    symbol: "mₚ",
    value: "2.176434",
    unit: "×10⁻⁸ kg",
    description: "Natural unit of mass"
  }
];

export default function TetrahedralPhysicsVisualizer({ isActive }: TetrahedralPhysicsVisualizerProps) {
  const tetrahedronRef = useRef<THREE.Group>(null);
  const [selectedConstant, setSelectedConstant] = useState<PlanckConstant | null>(null);
  const [time, setTime] = useState(0);
  const [entanglementPhase, setEntanglementPhase] = useState(0);

  // Tetrahedron geometry
  const tetrahedronGeometry = useMemo(() => {
    const geometry = new THREE.TetrahedronGeometry(2, 0);
    return geometry;
  }, []);

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    setEntanglementPhase(state.clock.elapsedTime * 0.5);

    if (tetrahedronRef.current && isActive) {
      // Rotate tetrahedron
      tetrahedronRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      tetrahedronRef.current.rotation.y = time * 0.2;
      tetrahedronRef.current.rotation.z = Math.cos(time * 0.4) * 0.1;
    }
  });

  // Harmonic frequencies
  const harmonicFrequencies = useMemo(() => [
    { freq: 94, label: "f₁", amplitude: 1.0 },
    { freq: 188, label: "f₂", amplitude: 0.8 },
    { freq: 376, label: "f₃", amplitude: 0.6 },
    { freq: 752, label: "f₄", amplitude: 0.4 }
  ], []);

  return (
    <group>
      {/* Main Tetrahedron */}
      <group ref={tetrahedronRef} position={[0, 0, 0]}>
        <mesh geometry={tetrahedronGeometry}>
          <meshStandardMaterial
            color="#4169E1"
            transparent
            opacity={0.7}
            wireframe={isActive}
            emissive="#4169E1"
            emissiveIntensity={isActive ? 0.3 : 0.1}
          />
        </mesh>

        {/* Tetrahedron vertices */}
        {[0, 1, 2, 3].map((vertex, index) => {
          const position = new THREE.Vector3();
          tetrahedronGeometry.vertices?.[vertex]?.clone(position);
          position.multiplyScalar(2.2); // Slightly outside the tetrahedron

          return (
            <group key={vertex} position={position}>
              <mesh>
                <sphereGeometry args={[0.1, 8, 6]} />
                <meshStandardMaterial
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={isActive ? 0.5 + Math.sin(time * 2 + index) * 0.3 : 0.2}
                />
              </mesh>

              {/* Vertex labels */}
              <Text
                position={[0, 0.3, 0]}
                fontSize={0.2}
                color="#ffe066"
                anchorX="center"
                anchorY="middle"
              >
                V{index + 1}
              </Text>
            </group>
          );
        })}

        {/* Force vectors */}
        {isActive && (
          <group>
            {[0, 1, 2, 3].map((vertex, index) => {
              const position = new THREE.Vector3();
              tetrahedronGeometry.vertices?.[vertex]?.clone(position);
              position.multiplyScalar(2);

              return (
                <mesh key={`force-${vertex}`} position={position}>
                  <cylinderGeometry args={[0.02, 0.02, 1]} />
                  <meshStandardMaterial
                    color="#32CD32"
                    transparent
                    opacity={0.6}
                    emissive="#32CD32"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              );
            })}
          </group>
        )}
      </group>

      {/* Planck Constants Display */}
      <group position={[4, 0, 0]}>
        {planckConstants.map((constant, index) => (
          <group key={constant.symbol} position={[0, 2 - index * 1.2, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.15}
              color="#ffe066"
              anchorX="left"
              anchorY="middle"
            >
              {constant.symbol} = {constant.value} {constant.unit}
            </Text>
            <Text
              position={[0, -0.3, 0]}
              fontSize={0.1}
              color="#4169E1"
              anchorX="left"
              anchorY="middle"
            >
              {constant.description}
            </Text>
          </group>
        ))}
      </group>

      {/* Harmonic Frequencies */}
      <group position={[-4, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Harmonic Series
        </Text>
        {harmonicFrequencies.map((harmonic, index) => (
          <group key={harmonic.freq} position={[0, 1.5 - index * 0.8, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.15}
              color="#32CD32"
              anchorX="left"
              anchorY="middle"
            >
              {harmonic.label}: {harmonic.freq} Hz
            </Text>
            {isActive && (
              <mesh position={[1.5, 0, 0]}>
                <boxGeometry args={[harmonic.amplitude * 0.5, 0.1, 0.1]} />
                <meshStandardMaterial
                  color="#32CD32"
                  emissive="#32CD32"
                  emissiveIntensity={0.5 + Math.sin(time * 3 + index) * 0.3}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Quantum Entanglement Visualization */}
      {isActive && (
        <group>
          {/* Entangled particles */}
          {[0, 1, 2, 3].map((particle, index) => {
            const angle = (index / 4) * Math.PI * 2 + entanglementPhase;
            const radius = 3;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            return (
              <group key={`particle-${index}`} position={[x, 0, z]}>
                <mesh>
                  <sphereGeometry args={[0.2, 8, 6]} />
                  <meshStandardMaterial
                    color="#8A2BE2"
                    emissive="#8A2BE2"
                    emissiveIntensity={0.5 + Math.sin(entanglementPhase * 2 + index) * 0.3}
                  />
                </mesh>

                {/* Entanglement connections */}
                {index < 3 && (
                  <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, radius * 0.8]} />
                    <meshStandardMaterial
                      color="#8A2BE2"
                      transparent
                      opacity={0.4}
                      emissive="#8A2BE2"
                      emissiveIntensity={0.2}
                    />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Action-at-Distance Demonstration */}
      {isActive && (
        <group position={[0, -3, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#FF4500"
            anchorX="center"
            anchorY="middle"
          >
            Instantaneous Action at Distance
          </Text>

          {/* Scalar wave propagation */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 4]} />
            <meshStandardMaterial
              color="#FF4500"
              transparent
              opacity={0.6}
              emissive="#FF4500"
              emissiveIntensity={0.3 + Math.sin(time * 4) * 0.2}
            />
          </mesh>
        </group>
      )}

      {/* Interactive Info Panel */}
      {selectedConstant && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-700 shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-[#ffe066] mb-2">{selectedConstant.name}</h3>
            <p className="text-sm text-blue-100 mb-3">{selectedConstant.description}</p>
            <div className="text-sm text-blue-200">
              <div className="font-mono text-[#ffe066]">
                {selectedConstant.symbol} = {selectedConstant.value} {selectedConstant.unit}
              </div>
            </div>
            <button
              onClick={() => setSelectedConstant(null)}
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