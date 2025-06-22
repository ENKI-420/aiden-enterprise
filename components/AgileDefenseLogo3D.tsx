"use client";

import { Float, Text } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Shield component representing defense
function DefenseShield({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Shield shape */}
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 2, 0.1]} />
          <meshStandardMaterial
            color="#1e40af"
            metalness={0.8}
            roughness={0.2}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Shield cross */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.3, 1.5, 0.05]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1, 0.3, 0.05]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </mesh>
  );
}

// DNA helix representing healthcare
function HealthcareDNA({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const helixPoints = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const angle = t * Math.PI * 4;
    helixPoints.push({
      x1: Math.cos(angle) * 0.5,
      z1: Math.sin(angle) * 0.5,
      x2: Math.cos(angle + Math.PI) * 0.5,
      z2: Math.sin(angle + Math.PI) * 0.5,
      y: (t - 0.5) * 3
    });
  }

  return (
    <group ref={groupRef} position={position}>
      {helixPoints.map((point, i) => (
        <group key={i}>
          <mesh position={[point.x1, point.y, point.z1]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[point.x2, point.y, point.z2]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#14b8a6" metalness={0.7} roughness={0.3} />
          </mesh>
          {i < helixPoints.length - 1 && (
            <mesh position={[(point.x1 + point.x2) / 2, point.y, (point.z1 + point.z2) / 2]}>
              <cylinderGeometry args={[0.02, 0.02, Math.sqrt((point.x2 - point.x1) ** 2 + (point.z2 - point.z1) ** 2), 8]} />
              <meshStandardMaterial color="#6ee7b7" metalness={0.5} roughness={0.5} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// Central orb with Aiden Engine branding
function AidenCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    setPulse(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.9}
          roughness={0.1}
          emissive="#8b5cf6"
          emissiveIntensity={pulse * 0.5}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Main logo scene
function LogoScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />

      {/* Central Aiden Core */}
      <AidenCore />

      {/* Defense Shield */}
      <DefenseShield position={[-2.5, 0, 0]} />

      {/* Healthcare DNA */}
      <HealthcareDNA position={[2.5, 0, 0]} />

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[3.5, 0.03, 16, 100]} />
        <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} opacity={0.7} transparent />
      </mesh>

      {/* Company text */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        AGILE DEFENSE SYSTEMS
      </Text>
      <Text
        position={[0, -3, 0]}
        fontSize={0.2}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        Powered by the AIDEN Engine
      </Text>
    </>
  );
}

export default function AgileDefenseLogo3D({
  width = 400,
  height = 400,
  className = "",
  interactive = true
}: {
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <LogoScene />
        {interactive && <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />}
      </Canvas>

      {/* Gradient background effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-blue-600/20 via-purple-600/10 to-transparent blur-3xl" />
    </div>
  );
}

// Orbit controls for interactivity
function OrbitControls({ enableZoom, autoRotate, autoRotateSpeed }: any) {
  const { camera, gl } = useThree();
  const controls = useRef<any>();

  useEffect(() => {
    const OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls;
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.enableZoom = enableZoom;
    controls.current.autoRotate = autoRotate;
    controls.current.autoRotateSpeed = autoRotateSpeed;
    controls.current.enablePan = false;
    controls.current.minPolarAngle = Math.PI / 3;
    controls.current.maxPolarAngle = Math.PI / 1.5;

    return () => controls.current.dispose();
  }, [camera, gl, enableZoom, autoRotate, autoRotateSpeed]);

  useFrame(() => controls.current?.update());

  return null;
}