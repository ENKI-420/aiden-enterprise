'use client';

import { Box, Html, Line, OrbitControls, Sphere } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Physics constants for the simulation
const PHYSICS_CONSTANTS = {
  GRAVITY: 9.81,
  SPEED_OF_LIGHT: 299792458,
  PLANCK_CONSTANT: 6.62607015e-34,
  BOLTZMANN_CONSTANT: 1.380649e-23,
  PERMITTIVITY_OF_FREE_SPACE: 8.85418782e-12,
  PERMEABILITY_OF_FREE_SPACE: 1.25663706e-6
};

// Energy beam visualization
const EnergyBeam = ({
  origin,
  target,
  intensity = 1,
  frequency = 1e12, // 1 THz
  active = false
}: {
  origin: [number, number, number];
  target: [number, number, number];
  intensity?: number;
  frequency?: number;
  active?: boolean;
}) => {
  const beamRef = useRef<THREE.Group>(null);
  const [beamPoints, setBeamPoints] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    const points = [];
    const segments = 100;
    const originVec = new THREE.Vector3(...origin);
    const targetVec = new THREE.Vector3(...target);
    const direction = targetVec.clone().sub(originVec);
    const distance = direction.length();

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = originVec.clone().lerp(targetVec, t);

      // Add wave-like distortion based on frequency
      const waveOffset = Math.sin(t * Math.PI * 20) * 0.1;
      point.add(new THREE.Vector3(waveOffset, waveOffset, waveOffset));

      points.push(point);
    }
    setBeamPoints(points);
  }, [origin, target]);

  useFrame((state) => {
    if (beamRef.current && active) {
      // Animate beam intensity
      const intensityVariation = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
      beamRef.current.children.forEach((child, index) => {
        if (child.material) {
          (child.material as THREE.MeshStandardMaterial).emissiveIntensity =
            intensity * intensityVariation * (1 - index / beamRef.current!.children.length);
        }
      });
    }
  });

  if (!active) return null;

  return (
    <group ref={beamRef}>
      {beamPoints.map((point, index) => (
        <Sphere
          key={index}
          args={[0.1, 8, 8]}
          position={[point.x, point.y, point.z]}
        >
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={intensity * (1 - index / beamPoints.length)}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}

      {/* Main beam line */}
      <Line
        points={beamPoints}
        color="#00FFFF"
        lineWidth={3}
        transparent
        opacity={0.6}
      />
    </group>
  );
};

// Scalar wave field visualization
const ScalarWaveField = ({ active = false, frequency = 1e9 }) => {
  const fieldRef = useRef<THREE.Group>(null);
  const [wavePoints, setWavePoints] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    const points = [];
    const radius = 100;
    const height = 200;
    const segments = 50;

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const phi = (i / segments) * Math.PI * 2;
        const theta = (j / segments) * Math.PI;
        const r = radius + Math.sin(phi * 3) * 10;
        const h = (j / segments) * height - height / 2;

        points.push(new THREE.Vector3(
          r * Math.sin(theta) * Math.cos(phi),
          h,
          r * Math.sin(theta) * Math.sin(phi)
        ));
      }
    }
    setWavePoints(points);
  }, []);

  useFrame((state) => {
    if (fieldRef.current && active) {
      fieldRef.current.children.forEach((point, index) => {
        const time = state.clock.elapsedTime;
        const phi = (index / wavePoints.length) * Math.PI * 2;
        const wave = Math.sin(time * frequency * 1e-9 + phi);

        point.position.y += wave * 0.01;
        if (point.material) {
          (point.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.3 + wave * 0.2;
        }
      });
    }
  });

  return (
    <group ref={fieldRef}>
      {wavePoints.map((point, index) => (
        <Sphere
          key={index}
          args={[0.05, 4, 4]}
          position={[point.x, point.y, point.z]}
        >
          <meshStandardMaterial
            color="#E6E6FA"
            emissive="#E6E6FA"
            emissiveIntensity={0.1}
            transparent
            opacity={0.3}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Celestial target visualization
const CelestialTarget = ({
  position,
  size = 1,
  name = "Target",
  distance = 1000,
  hit = false
}: {
  position: [number, number, number];
  size?: number;
  name?: string;
  distance?: number;
  hit?: boolean;
}) => {
  const targetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (targetRef.current && hit) {
      targetRef.current.material.emissiveIntensity =
        0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={targetRef} args={[size, 16, 16]}>
        <meshStandardMaterial
          color={hit ? "#FF4444" : "#444444"}
          emissive={hit ? "#FF4444" : "#222222"}
          emissiveIntensity={hit ? 0.5 : 0.1}
        />
      </Sphere>

      <Html position={[0, size + 2, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1 border border-gray-600">
          <div className="text-white text-xs font-medium">{name}</div>
          <div className="text-gray-400 text-xs">{distance.toLocaleString()} km</div>
        </div>
      </Html>
    </group>
  );
};

// Energy calculation display
const EnergyCalculations = ({
  beamPower = 1e12, // 1 TW
  frequency = 1e12,  // 1 THz
  distance = 1e6,    // 1000 km
  efficiency = 0.85
}: {
  beamPower?: number;
  frequency?: number;
  distance?: number;
  efficiency?: number;
}) => {
  // Calculate energy density at target
  const beamArea = Math.PI * Math.pow(10, 2); // 10m radius beam
  const energyDensity = (beamPower * efficiency) / beamArea;

  // Calculate wavelength
  const wavelength = PHYSICS_CONSTANTS.SPEED_OF_LIGHT / frequency;

  // Calculate photon energy
  const photonEnergy = PHYSICS_CONSTANTS.PLANCK_CONSTANT * frequency;

  // Calculate atmospheric absorption (simplified)
  const atmosphericAbsorption = Math.exp(-distance * 1e-6); // Simplified model

  // Calculate final energy at target
  const finalEnergy = energyDensity * atmosphericAbsorption;

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
      <h3 className="text-amber-400 font-bold text-sm mb-3">Energy Calculations</h3>

      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Beam Power:</span>
          <span className="text-amber-300">{(beamPower / 1e12).toFixed(1)} TW</span>
        </div>

        <div className="flex justify-between">
          <span>Frequency:</span>
          <span className="text-amber-300">{(frequency / 1e12).toFixed(1)} THz</span>
        </div>

        <div className="flex justify-between">
          <span>Wavelength:</span>
          <span className="text-amber-300">{(wavelength * 1e6).toFixed(2)} μm</span>
        </div>

        <div className="flex justify-between">
          <span>Photon Energy:</span>
          <span className="text-amber-300">{(photonEnergy * 1e15).toFixed(2)} fJ</span>
        </div>

        <div className="flex justify-between">
          <span>Energy Density:</span>
          <span className="text-amber-300">{(energyDensity / 1e9).toFixed(1)} GW/m²</span>
        </div>

        <div className="flex justify-between">
          <span>Atmospheric Loss:</span>
          <span className="text-amber-300">{(1 - atmosphericAbsorption) * 100}%</span>
        </div>

        <div className="flex justify-between">
          <span>Final Energy:</span>
          <span className="text-amber-300">{(finalEnergy / 1e9).toFixed(1)} GW/m²</span>
        </div>
      </div>
    </div>
  );
};

// Main physics simulation scene
const PhysicsScene = ({
  beamActive = false,
  targetHit = false,
  showCalculations = false
}: {
  beamActive?: boolean;
  targetHit?: boolean;
  showCalculations?: boolean;
}) => {
  const sceneRef = useRef<THREE.Group>(null);

  // Pyramid position (origin of beam)
  const pyramidPosition: [number, number, number] = [0, 73.3, 0];

  // Celestial targets
  const targets = [
    { position: [0, 1000, 0] as [number, number, number], name: "Low Earth Orbit", distance: 400, size: 2 },
    { position: [0, 2000, 0] as [number, number, number], name: "Medium Earth Orbit", distance: 2000, size: 1.5 },
    { position: [0, 5000, 0] as [number, number, number], name: "Geosynchronous", distance: 35786, size: 1 },
  ];

  return (
    <>
      {/* Pyramid base */}
      <Box args={[230.4, 146.6, 230.4]} position={[0, 73.3, 0]}>
        <meshStandardMaterial
          color="#D2B48C"
          transparent
          opacity={0.3}
        />
      </Box>

      {/* Energy beam */}
      {beamActive && (
        <EnergyBeam
          origin={pyramidPosition}
          target={[0, 1000, 0]}
          intensity={1}
          frequency={1e12}
          active={true}
        />
      )}

      {/* Scalar wave field */}
      <ScalarWaveField active={beamActive} frequency={1e9} />

      {/* Celestial targets */}
      {targets.map((target, index) => (
        <CelestialTarget
          key={index}
          position={target.position}
          size={target.size}
          name={target.name}
          distance={target.distance}
          hit={targetHit && index === 0}
        />
      ))}

      {/* Energy calculations overlay */}
      {showCalculations && (
        <Html position={[100, 100, 0]}>
          <EnergyCalculations />
        </Html>
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
    </>
  );
};

// Main component
export default function PyramidPhysicsSimulation() {
  const [beamActive, setBeamActive] = useState(false);
  const [targetHit, setTargetHit] = useState(false);
  const [showCalculations, setShowCalculations] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Simulate beam activation sequence
  useEffect(() => {
    if (beamActive) {
      const timer = setTimeout(() => {
        setTargetHit(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setTargetHit(false);
    }
  }, [beamActive]);

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-amber-500/20">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [200, 200, 200], fov: 60 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <PhysicsScene
            beamActive={beamActive}
            targetHit={targetHit}
            showCalculations={showCalculations}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={1000}
            minDistance={50}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[0, 100, 0]} intensity={0.5} color="#00FFFF" />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
          <h3 className="text-amber-400 font-bold text-sm mb-3">Physics Simulation</h3>

          <div className="space-y-2">
            <button
              onClick={() => setBeamActive(!beamActive)}
              className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                beamActive
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'
              }`}
            >
              {beamActive ? 'Deactivate' : 'Activate'} Energy Beam
            </button>

            <button
              onClick={() => setShowCalculations(!showCalculations)}
              className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
                showCalculations
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50'
              }`}
            >
              {showCalculations ? 'Hide' : 'Show'} Calculations
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600/50">
            <label className="text-slate-400 text-xs font-medium block mb-2">
              Simulation Speed: {simulationSpeed}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Simulation speed control"
              title="Adjust simulation speed from 0.1x to 5x"
            />
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
        <h3 className="text-amber-400 font-bold text-sm mb-2">System Status</h3>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${beamActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-slate-300">Energy Beam: {beamActive ? 'ACTIVE' : 'STANDBY'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${targetHit ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span className="text-slate-300">Target Status: {targetHit ? 'HIT' : 'TRACKING'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-slate-300">Scalar Field: {beamActive ? 'GENERATING' : 'QUIESCENT'}</span>
          </div>
        </div>
      </div>

      {/* Physics Information */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30 max-w-xs">
        <h3 className="text-amber-400 font-bold text-sm mb-3">Weapon Physics</h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div>
            <h4 className="text-amber-300 font-medium">Beam Properties</h4>
            <p className="text-slate-400 mt-1">
              Frequency: 1 THz (Terahertz)<br/>
              Power: 1 TW (Terawatt)<br/>
              Wavelength: 300 μm<br/>
              Beam Radius: 10m
            </p>
          </div>

          <div>
            <h4 className="text-amber-300 font-medium">Target Effects</h4>
            <p className="text-slate-400 mt-1">
              Energy Density: ~1 GW/m²<br/>
              Penetration: Deep atmospheric<br/>
              Range: Planetary scale<br/>
              Accuracy: Sub-arcsecond
            </p>
          </div>

          <div>
            <h4 className="text-amber-300 font-medium">Scalar Wave Theory</h4>
            <p className="text-slate-400 mt-1">
              Non-Hertzian energy transmission<br/>
              Instantaneous action at distance<br/>
              Geometric resonance amplification<br/>
              Zero-point energy coupling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}