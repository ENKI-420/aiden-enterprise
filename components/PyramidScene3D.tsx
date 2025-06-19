'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

type SceneMode = 'geometric' | 'acoustic' | 'electromagnetic' | 'quantum';

interface ChamberData {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description: string;
  measurements: Record<string, string>;
}

const chambers: ChamberData[] = [
  {
    name: "King's Chamber",
    position: [0, 1.5, 0],
    size: [5.2, 2.6, 10.5],
    color: "#FFD700",
    description: "Primary resonator chamber with granite construction",
    measurements: {
      "Frequency": "94 Hz",
      "Q-Factor": "142",
      "Material": "Granite",
      "Dimensions": "5.2m × 2.6m × 10.5m"
    }
  },
  {
    name: "Queen's Chamber",
    position: [0, 0.8, 0],
    size: [4.6, 2.3, 5.2],
    color: "#4169E1",
    description: "Electrochemical node with limestone construction",
    measurements: {
      "Frequency": "188 Hz",
      "Q-Factor": "89",
      "Material": "Limestone",
      "Dimensions": "4.6m × 2.3m × 5.2m"
    }
  },
  {
    name: "Grand Gallery",
    position: [0, 0.3, 0],
    size: [2.1, 8.6, 47],
    color: "#32CD32",
    description: "Acoustic accelerator with corbelled ceiling",
    measurements: {
      "Frequency": "376 Hz",
      "Q-Factor": "67",
      "Material": "Limestone",
      "Dimensions": "2.1m × 8.6m × 47m"
    }
  },
  {
    name: "Grotto",
    position: [0, -0.5, 0],
    size: [2, 2, 2],
    color: "#8A2BE2",
    description: "Helmholtz cavity resonator",
    measurements: {
      "Frequency": "752 Hz",
      "Q-Factor": "45",
      "Material": "Natural rock",
      "Dimensions": "2m × 2m × 2m"
    }
  }
];

interface PyramidScene3DProps {
  mode: SceneMode;
}

export default function PyramidScene3D({ mode }: PyramidScene3DProps) {
  const pyramidRef = useRef<THREE.Group>(null);
  const [selectedChamber, setSelectedChamber] = useState<ChamberData | null>(null);
  const [time, setTime] = useState(0);

  // Pyramid dimensions (Great Pyramid of Giza)
  const baseLength = 230.4; // meters
  const height = 146.6; // meters
  const scale = 0.01; // Scale down for visualization

  const scaledBase = baseLength * scale;
  const scaledHeight = height * scale;

  // Calculate pyramid vertices
  const pyramidGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Base vertices
      -scaledBase/2, 0, -scaledBase/2,  // 0
      scaledBase/2, 0, -scaledBase/2,   // 1
      scaledBase/2, 0, scaledBase/2,    // 2
      -scaledBase/2, 0, scaledBase/2,   // 3
      // Apex
      0, scaledHeight, 0,               // 4
    ]);

    const indices = new Uint16Array([
      // Base
      0, 1, 2, 0, 2, 3,
      // Sides
      0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }, [scaledBase, scaledHeight]);

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    if (pyramidRef.current) {
      // Gentle rotation based on mode
      const rotationSpeed = mode === 'quantum' ? 0.1 : 0.05;
      pyramidRef.current.rotation.y = Math.sin(time * rotationSpeed) * 0.1;
    }
  });

  // Get color based on mode and resonance state
  const getChamberColor = (chamber: ChamberData, isResonant: boolean) => {
    if (mode === 'acoustic' && isResonant) {
      return new THREE.Color(chamber.color).multiplyScalar(1.5);
    }
    if (mode === 'electromagnetic') {
      return new THREE.Color(chamber.color).multiplyScalar(0.8 + Math.sin(time * 2) * 0.2);
    }
    if (mode === 'quantum') {
      return new THREE.Color(chamber.color).multiplyScalar(1 + Math.sin(time * 3 + chamber.position[1]) * 0.3);
    }
    return new THREE.Color(chamber.color);
  };

  return (
    <group ref={pyramidRef}>
      {/* Main Pyramid Structure */}
      <mesh geometry={pyramidGeometry}>
        <meshStandardMaterial
          color={mode === 'geometric' ? "#4169E1" : "#2a4a8a"}
          transparent
          opacity={0.3}
          wireframe={mode === 'geometric'}
        />
      </mesh>

      {/* Internal Chambers */}
      {chambers.map((chamber, index) => {
        const isResonant = Math.sin(time * 2 + index) > 0.5;
        const color = getChamberColor(chamber, isResonant);

        return (
          <group key={chamber.name}>
            {/* Chamber Box */}
            <motion.mesh
              position={chamber.position}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedChamber(selectedChamber === chamber ? null : chamber)}
            >
              <boxGeometry args={chamber.size} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.7}
                emissive={color}
                emissiveIntensity={isResonant ? 0.3 : 0.1}
              />
            </motion.mesh>

            {/* Chamber Label */}
            <Text
              position={[chamber.position[0], chamber.position[1] + chamber.size[1]/2 + 0.5, chamber.position[2]]}
              fontSize={0.3}
              color="#ffe066"
              anchorX="center"
              anchorY="middle"
            >
              {chamber.name}
            </Text>

            {/* Resonance Indicators */}
            {isResonant && (
              <mesh position={chamber.position}>
                <sphereGeometry args={[Math.max(...chamber.size) * 0.6, 8, 6]} />
                <meshStandardMaterial
                  color={chamber.color}
                  transparent
                  opacity={0.2}
                  wireframe
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Apex Emission Point */}
      <mesh position={[0, scaledHeight, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={0.5 + Math.sin(time * 4) * 0.3}
        />
      </mesh>

      {/* Energy Flow Paths */}
      {mode === 'electromagnetic' && (
        <group>
          {chambers.map((chamber, index) => (
            <mesh key={`flow-${index}`} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, scaledHeight * 0.8]} />
              <meshStandardMaterial
                color="#4169E1"
                transparent
                opacity={0.6}
                emissive="#4169E1"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Quantum Entanglement Visualization */}
      {mode === 'quantum' && (
        <group>
          {chambers.map((chamber, i) =>
            chambers.slice(i + 1).map((otherChamber, j) => (
              <mesh key={`entangle-${i}-${j}`}>
                <cylinderGeometry args={[0.01, 0.01, 1]} />
                <meshStandardMaterial
                  color="#8A2BE2"
                  transparent
                  opacity={0.4}
                  emissive="#8A2BE2"
                  emissiveIntensity={0.1}
                />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* Chamber Info Panel */}
      {selectedChamber && (
        <Html position={[2, 0, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-700 shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-[#ffe066] mb-2">{selectedChamber.name}</h3>
            <p className="text-sm text-blue-100 mb-3">{selectedChamber.description}</p>
            <div className="space-y-1">
              {Object.entries(selectedChamber.measurements).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-blue-200">{key}:</span>
                  <span className="text-[#ffe066] font-mono">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedChamber(null)}
              className="mt-3 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Html>
      )}

      {/* Mode-specific Overlays */}
      {mode === 'acoustic' && (
        <group>
          {/* Standing Wave Visualization */}
          {chambers.map((chamber, index) => (
            <mesh key={`wave-${index}`} position={chamber.position}>
              <cylinderGeometry args={[0.05, 0.05, chamber.size[1] * 2]} />
              <meshStandardMaterial
                color="#32CD32"
                transparent
                opacity={0.3}
                emissive="#32CD32"
                emissiveIntensity={0.2 + Math.sin(time * 3 + index) * 0.1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}