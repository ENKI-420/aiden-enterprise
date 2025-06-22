'use client';

import { Box, Cylinder, Html, OrbitControls, Sphere, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Material properties for different pyramid components
const MATERIALS = {
  limestone: {
    color: '#D2B48C',
    roughness: 0.8,
    metalness: 0.1,
    opacity: 0.9
  },
  granite: {
    color: '#696969',
    roughness: 0.6,
    metalness: 0.2,
    opacity: 0.95
  },
  basalt: {
    color: '#2F4F4F',
    roughness: 0.7,
    metalness: 0.15,
    opacity: 0.9
  },
  energy: {
    color: '#00FFFF',
    roughness: 0.1,
    metalness: 0.9,
    opacity: 0.7,
    emissive: '#00FFFF',
    emissiveIntensity: 0.5
  },
  crystal: {
    color: '#E6E6FA',
    roughness: 0.1,
    metalness: 0.8,
    opacity: 0.3,
    emissive: '#E6E6FA',
    emissiveIntensity: 0.3
  }
};

// Energy flow visualization
const EnergyFlow = ({ intensity = 1, frequency = 1 }) => {
  const points = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    const particleCount = 1000;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 50 + Math.sin(angle * 3) * 10;
      const height = (i / particleCount) * 146.6; // Pyramid height in meters

      newParticles.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        )
      );
    }
    setParticles(newParticles);
  }, []);

  useFrame((state) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime * frequency + i * 0.1) * intensity * 0.1;
      }

      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color={MATERIALS.energy.color}
        transparent
        opacity={0.6}
        emissive={MATERIALS.energy.color}
        emissiveIntensity={intensity}
      />
    </points>
  );
};

// Scalar wave visualization
const ScalarWaves = ({ active = false }) => {
  const waves = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (waves.current && active) {
      waves.current.children.forEach((wave, index) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
        wave.scale.setScalar(scale);
        wave.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
      });
    }
  });

  return (
    <group ref={waves}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 73.3, 0]}> {/* King's Chamber level */}
          <sphereGeometry args={[20 + i * 5, 32, 32]} />
          <meshStandardMaterial
            color={MATERIALS.energy.color}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

// Internal chambers visualization
const InternalChambers = ({ showDetails = false }) => {
  const chambers = useRef<THREE.Group>(null);

  return (
    <group ref={chambers}>
      {/* King's Chamber */}
      <Box args={[10.47, 5.84, 5.23]} position={[0, 73.3, 0]}>
        <meshStandardMaterial
          color={MATERIALS.granite.color}
          roughness={MATERIALS.granite.roughness}
          metalness={MATERIALS.granite.metalness}
          transparent
          opacity={showDetails ? 0.3 : 0.1}
        />
      </Box>

      {/* Queen's Chamber */}
      <Box args={[5.76, 6.26, 5.23]} position={[0, 45, 0]}>
        <meshStandardMaterial
          color={MATERIALS.limestone.color}
          roughness={MATERIALS.limestone.roughness}
          metalness={MATERIALS.limestone.metalness}
          transparent
          opacity={showDetails ? 0.3 : 0.1}
        />
      </Box>

      {/* Subterranean Chamber */}
      <Box args={[14.02, 4.11, 8.35]} position={[0, -30, 0]}>
        <meshStandardMaterial
          color={MATERIALS.basalt.color}
          roughness={MATERIALS.basalt.roughness}
          metalness={MATERIALS.basalt.metalness}
          transparent
          opacity={showDetails ? 0.3 : 0.1}
        />
      </Box>

      {/* Grand Gallery */}
      <Box args={[2.09, 8.74, 46.71]} position={[0, 60, 0]}>
        <meshStandardMaterial
          color={MATERIALS.limestone.color}
          roughness={MATERIALS.limestone.roughness}
          metalness={MATERIALS.limestone.metalness}
          transparent
          opacity={showDetails ? 0.2 : 0.05}
        />
      </Box>

      {/* Air shafts */}
      {showDetails && (
        <>
          <Cylinder args={[0.2, 0.2, 60]} position={[-2, 60, 0]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#444" transparent opacity={0.5} />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 60]} position={[2, 60, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <meshStandardMaterial color="#444" transparent opacity={0.5} />
          </Cylinder>
        </>
      )}
    </group>
  );
};

// Crystal resonator visualization
const CrystalResonators = ({ active = false }) => {
  const crystals = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (crystals.current && active) {
      crystals.current.children.forEach((crystal, index) => {
        crystal.rotation.y += 0.01;
        crystal.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.01;
        (crystal.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.3 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
      });
    }
  });

  const crystalPositions = [
    [0, 73.3, 0], // King's Chamber
    [0, 45, 0],   // Queen's Chamber
    [0, -30, 0],  // Subterranean Chamber
    [0, 60, 0],   // Grand Gallery
  ];

  return (
    <group ref={crystals}>
      {crystalPositions.map((pos, index) => (
        <Sphere key={index} args={[1, 16, 16]} position={pos as [number, number, number]}>
          <meshStandardMaterial
            color={MATERIALS.crystal.color}
            roughness={MATERIALS.crystal.roughness}
            metalness={MATERIALS.crystal.metalness}
            transparent
            opacity={active ? 0.6 : 0.2}
            emissive={MATERIALS.crystal.color}
            emissiveIntensity={active ? 0.3 : 0.1}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Main pyramid structure
const GreatPyramid = ({ showInternal = false, energyActive = false }) => {
  const pyramidRef = useRef<THREE.Group>(null);

  return (
    <group ref={pyramidRef}>
      {/* Main pyramid structure */}
      <mesh position={[0, 73.3, 0]}>
        <coneGeometry args={[115.2, 146.6, 4]} /> {/* Base: 230.4m, Height: 146.6m */}
        <meshStandardMaterial
          color={MATERIALS.limestone.color}
          roughness={MATERIALS.limestone.roughness}
          metalness={MATERIALS.limestone.metalness}
          transparent
          opacity={showInternal ? 0.3 : 0.8}
        />
      </mesh>

      {/* Internal chambers */}
      {showInternal && <InternalChambers showDetails={true} />}

      {/* Energy systems */}
      {energyActive && (
        <>
          <EnergyFlow intensity={1} frequency={2} />
          <ScalarWaves active={true} />
          <CrystalResonators active={true} />
        </>
      )}

      {/* Crystal resonators (always visible but dimmed when inactive) */}
      <CrystalResonators active={false} />
    </group>
  );
};

// Information overlay for different components
const InfoOverlay = ({ component, position }: { component: string; position: [number, number, number] }) => {
  const [hovered, setHovered] = useState(false);

  const info = {
    kingsChamber: {
      title: "King's Chamber",
      description: "Granite chamber with precise dimensions. Believed to be the main energy resonator.",
      materials: "Granite, Limestone",
      dimensions: "10.47m × 5.84m × 5.23m"
    },
    queensChamber: {
      title: "Queen's Chamber",
      description: "Limestone chamber with unique architectural features. Secondary resonator.",
      materials: "Limestone",
      dimensions: "5.76m × 6.26m × 5.23m"
    },
    grandGallery: {
      title: "Grand Gallery",
      description: "Corbelled passage with precise slope. Energy amplification corridor.",
      materials: "Limestone",
      dimensions: "2.09m × 8.74m × 46.71m"
    },
    subterranean: {
      title: "Subterranean Chamber",
      description: "Basalt chamber below ground level. Energy grounding and storage.",
      materials: "Basalt, Limestone",
      dimensions: "14.02m × 4.11m × 8.35m"
    }
  };

  const componentInfo = info[component as keyof typeof info];

  return (
    <Html position={position} center>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30 text-white max-w-xs"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h3 className="text-amber-400 font-bold text-sm mb-2">{componentInfo.title}</h3>
        <p className="text-xs text-gray-300 mb-2">{componentInfo.description}</p>
        <div className="text-xs text-gray-400">
          <div><strong>Materials:</strong> {componentInfo.materials}</div>
          <div><strong>Dimensions:</strong> {componentInfo.dimensions}</div>
        </div>
      </motion.div>
    </Html>
  );
};

// Main 3D Scene Component
const PyramidScene = ({
  showInternal = false,
  energyActive = false,
  showInfo = false,
  cameraPosition = [100, 100, 100] as [number, number, number]
}) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.lookAt(0, 73.3, 0);
  }, [camera, cameraPosition]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 100, 0]} intensity={0.5} color="#00FFFF" />

      <GreatPyramid showInternal={showInternal} energyActive={energyActive} />

      {/* Information overlays */}
      {showInfo && (
        <>
          <InfoOverlay component="kingsChamber" position={[0, 73.3, 0]} />
          <InfoOverlay component="queensChamber" position={[0, 45, 0]} />
          <InfoOverlay component="grandGallery" position={[0, 60, 0]} />
          <InfoOverlay component="subterranean" position={[0, -30, 0]} />
        </>
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>

      {/* Stars background */}
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
    </>
  );
};

// Main component with controls
export default function Pyramid3DVisualization() {
  const [showInternal, setShowInternal] = useState(false);
  const [energyActive, setEnergyActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cameraView, setCameraView] = useState<'overview' | 'internal' | 'energy'>('overview');

  const cameraPositions = {
    overview: [150, 150, 150] as [number, number, number],
    internal: [50, 100, 50] as [number, number, number],
    energy: [80, 120, 80] as [number, number, number]
  };

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-amber-500/20">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: cameraPositions[cameraView], fov: 60 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PyramidScene
            showInternal={showInternal}
            energyActive={energyActive}
            showInfo={showInfo}
            cameraPosition={cameraPositions[cameraView]}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={300}
            minDistance={20}
          />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
          <h3 className="text-amber-400 font-bold text-sm mb-3">Pyramid Controls</h3>

          <div className="space-y-2">
            <button
              onClick={() => setShowInternal(!showInternal)}
              className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                showInternal
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50'
              }`}
            >
              {showInternal ? 'Hide' : 'Show'} Internal Structure
            </button>

            <button
              onClick={() => setEnergyActive(!energyActive)}
              className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                energyActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50'
              }`}
            >
              {energyActive ? 'Deactivate' : 'Activate'} Energy Systems
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                showInfo
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50'
              }`}
            >
              {showInfo ? 'Hide' : 'Show'} Information
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600/50">
            <h4 className="text-slate-400 text-xs font-medium mb-2">Camera Views</h4>
            <div className="space-y-1">
              {Object.entries(cameraPositions).map(([view, _]) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view as keyof typeof cameraPositions)}
                  className={`w-full px-2 py-1 rounded text-xs transition-colors ${
                    cameraView === view
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Physics Information Panel */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30 max-w-xs">
        <h3 className="text-amber-400 font-bold text-sm mb-3">Physics & Engineering</h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div>
            <h4 className="text-amber-300 font-medium">Material Properties</h4>
            <p className="text-slate-400 mt-1">
              Granite: High density, piezoelectric properties<br/>
              Limestone: Acoustic resonance characteristics<br/>
              Basalt: Electromagnetic shielding properties
            </p>
          </div>

          <div>
            <h4 className="text-amber-300 font-medium">Energy Systems</h4>
            <p className="text-slate-400 mt-1">
              Scalar wave generation through geometric resonance<br/>
              Crystal amplification in chamber networks<br/>
              Feedback loops for energy multiplication
            </p>
          </div>

          <div>
            <h4 className="text-amber-300 font-medium">Weapon Hypothesis</h4>
            <p className="text-slate-400 mt-1">
              Directed energy projection through focused scalar waves<br/>
              Celestial targeting via precise geometric alignment<br/>
              Planetary-scale effects through resonance amplification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}