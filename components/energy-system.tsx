"use client";

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function EnergyField() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#00ff88" wireframe />
    </mesh>
  );
}

export default function EnergySystem() {
  const [energyLevel, setEnergyLevel] = useState(0.5);
  const [weaponArmed, setWeaponArmed] = useState(false);

  return (
    <section className='bg-black bg-opacity-80 text-white p-8 rounded-lg max-w-2xl mx-auto my-12 space-y-6'>
      <h2 className='text-2xl font-bold'>Pyramid Energy System</h2>
      <div className='mb-4'>
        <label htmlFor='energy-slider' className='block mb-2'>
          Scalar Wave Intensity
        </label>
        <input
          id='energy-slider'
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={energyLevel}
          onChange={(e) => setEnergyLevel(Number(e.target.value))}
          className='w-full'
        />
        <div className='mt-2'>Current Intensity: {(energyLevel * 100).toFixed(0)}%</div>
      </div>
      <button
        className={`px-4 py-2 rounded ${weaponArmed ? 'bg-red-600' : 'bg-green-600'
          } text-white font-bold`}
        onClick={() => setWeaponArmed(!weaponArmed)}
      >
        {weaponArmed ? 'Deactivate Weapon' : 'Arm Weapon'}
      </button>
      <div className='mt-6'>
        <div>
          <strong>Status:</strong>{' '}
          {weaponArmed
            ? `Weapon ARMED. Energy at ${(energyLevel * 100).toFixed(0)}%.`
            : 'Weapon is safe. Adjust energy and arm to activate.'}
        </div>
        {/* 3D Visualization */}
        <div className='mt-8 w-full h-72 rounded-lg overflow-hidden bg-black'>
          <Canvas camera={{ position: [0, 1.5, 4], fov: 60 }} shadows>
            {/* Ambient and directional light */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
            {/* Scalar wave generator (crystal) */}
            <mesh position={[0, 1, 0]}>
              <octahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial
                color='#00fff7'
                emissive='#00fff7'
                emissiveIntensity={energyLevel * 1.5}
                metalness={0.6}
                roughness={0.2}
              />
            </mesh>
            {/* Feedback loop (torus) */}
            <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.8, 0.07, 16, 100]} />
              <meshStandardMaterial
                color='#3b82f6'
                emissive='#3b82f6'
                emissiveIntensity={energyLevel}
              />
            </mesh>
            {/* Reactor-like chamber (sphere) */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial
                color='#fff'
                emissive='#facc15'
                emissiveIntensity={energyLevel * 0.7}
              />
            </mesh>
            {/* Weapon beam (if armed) */}
            {weaponArmed && (
              <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 3, 32]} />
                <meshBasicMaterial color='#00fff7' transparent opacity={0.7} />
              </mesh>
            )}
            {/* Feedback loop nodes (junctions) */}
            <mesh position={[-0.8, 1, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color='#38bdf8'
                emissive='#38bdf8'
                emissiveIntensity={energyLevel}
              />
            </mesh>
            <mesh position={[0.8, 1, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color='#38bdf8'
                emissive='#38bdf8'
                emissiveIntensity={energyLevel}
              />
            </mesh>
            <mesh position={[0, 1, 0.8]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color='#38bdf8'
                emissive='#38bdf8'
                emissiveIntensity={energyLevel}
              />
            </mesh>
            <mesh position={[0, 1, -0.8]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color='#38bdf8'
                emissive='#38bdf8'
                emissiveIntensity={energyLevel}
              />
            </mesh>
            {/* Energy pathway lines (magnification process) */}
            <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
              <meshStandardMaterial
                color='#f472b6'
                emissive='#f472b6'
                emissiveIntensity={energyLevel * 0.7}
              />
            </mesh>
            <mesh position={[0, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
              <meshStandardMaterial
                color='#f472b6'
                emissive='#f472b6'
                emissiveIntensity={energyLevel * 0.7}
              />
            </mesh>
            <EnergyField />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
