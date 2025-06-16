'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { OrbitControls, Sky, Loader, useGLTF } from '@react-three/drei';
import { useState, Suspense, useRef } from 'react';
import EnergySlider from '@/components/energy-slider';

export default function ImmersivePage() {
  const [demoType, setDemoType] = useState('beam');
  const [intensity, setIntensity] = useState(0.7);
  const [showNarrative, setShowNarrative] = useState(true);
  const [weaponActive, setWeaponActive] = useState(false);
  // Load 3D pyramid model
  const { scene } = useGLTF('/models/pyramid.glb');

  return (
    <div className='w-full h-screen relative'>
      {/* Demo selector */}
      <div className='absolute top-4 right-4 bg-white bg-opacity-70 p-2 rounded'>
        <label htmlFor='demo-select' className='mr-2 font-medium'>
          Demo:
        </label>
        <select
          id='demo-select'
          aria-label='Demo Type Selector'
          value={demoType}
          onChange={(e) => setDemoType(e.target.value)}
          className='p-1'
        >
          <option value='beam'>Weapon Beam</option>
          <option value='none'>None</option>
        </select>
      </div>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[1, 1, 0]} distance={450000} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
          <Physics>
            <primitive object={scene} position={[0, 0, 0]} castShadow />
            {/* energy core */}
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial emissive='cyan' emissiveIntensity={intensity} color='black' />
            </mesh>
            {/* Weapon Beam Demo */}
            {demoType === 'beam' && <DemoBeam active={weaponActive} />}
          </Physics>
          <OrbitControls />
        </Suspense>
      </Canvas>
      <Loader />
      {/* Demo control */}
      {demoType === 'beam' && (
        <button
          onClick={() => setWeaponActive(true)}
          className='absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-2 rounded'
        >
          Activate Weapon Demo
        </button>
      )}
      {/* narrative overlay */}
      {showNarrative && (
        <div className='absolute top-0 left-0 p-8 bg-black bg-opacity-80 text-white max-w-md rounded-br-lg pointer-events-auto'>
          <button
            onClick={() => setShowNarrative(false)}
            className='absolute top-2 right-2 text-white text-xl'
            aria-label='Close narrative'
          >
            ×
          </button>
          <h2 className='text-2xl font-bold mb-2'>A Glimpse of the Future with AGENT-M3c by ADS</h2>
          <p className='italic mb-4'>
            "The Truth About Human Knowledge: A Flawed Understanding of Technology"
          </p>
          <p>
            We live in an age where humanity's achievements in healthcare, legal systems, and
            defense are lauded as cutting-edge innovations. But the harsh truth is that what we have
            mastered is only a fraction of what’s possible.
          </p>
          <p className='mt-2'>
            In a world that prides itself on security, intelligence, and technological advancement,
            AGENT-M3c by Agile Defense Systems shatters the illusion of our species' understanding.
          </p>
          <p className='mt-2'>{`But here's the kicker: What if our pyramids, once thought to be simple tombs, were machines—weapons of mass destruction—built by an ancient civilization whose understanding of energy and matter manipulation far surpassed our own?`}</p>
        </div>
      )}
      {/* energy slider overlay */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto'>
        <EnergySlider value={intensity} onChange={setIntensity} />
      </div>
    </div>
  );

  function DemoBeam({ active }: { active: boolean }) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
      if (active && ref.current) {
        ref.current.scale.z = Math.min(ref.current.scale.z + delta * 20, 40);
      }
    });
    return (
      <mesh ref={ref} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshBasicMaterial color='cyan' transparent opacity={0.7} />
      </mesh>
    );
  }
}
