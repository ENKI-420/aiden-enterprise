'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface AcousticResonanceMapperProps {
  isActive: boolean;
}

interface StandingWave {
  frequency: number;
  amplitude: number;
  phase: number;
  wavelength: number;
  nodes: number;
  antinodes: number;
}

export default function AcousticResonanceMapper({ isActive }: AcousticResonanceMapperProps) {
  const chamberRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  const [selectedFrequency, setSelectedFrequency] = useState<number>(94);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Standing wave data
  const standingWaves = useMemo<StandingWave[]>(() => [
    {
      frequency: 94,
      amplitude: 1.0,
      phase: 0,
      wavelength: 3.66, // Speed of sound / frequency
      nodes: 2,
      antinodes: 1
    },
    {
      frequency: 188,
      amplitude: 0.8,
      phase: 45,
      wavelength: 1.83,
      nodes: 3,
      antinodes: 2
    },
    {
      frequency: 376,
      amplitude: 0.6,
      phase: 90,
      wavelength: 0.915,
      nodes: 4,
      antinodes: 3
    },
    {
      frequency: 752,
      amplitude: 0.4,
      phase: 135,
      wavelength: 0.457,
      nodes: 5,
      antinodes: 4
    }
  ], []);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, [audioContext]);

  // Play frequency
  const playFrequency = (frequency: number) => {
    if (!audioContext || !isPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  // Animation loop
  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    if (chamberRef.current && isActive) {
      // Gentle chamber vibration
      chamberRef.current.position.y = Math.sin(time * 2) * 0.01;
    }

    // Play selected frequency periodically
    if (isPlaying && time % 2 < 0.1) {
      playFrequency(selectedFrequency);
    }
  });

  // Chamber dimensions (King's Chamber)
  const chamberDimensions = {
    length: 10.5,
    width: 5.2,
    height: 2.6
  };

  const scale = 0.1; // Scale down for visualization

  return (
    <group>
      {/* Main Chamber */}
      <group ref={chamberRef} position={[0, 0, 0]}>
        {/* Chamber walls */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[
            chamberDimensions.width * scale,
            chamberDimensions.height * scale,
            chamberDimensions.length * scale
          ]} />
          <meshStandardMaterial
            color="#4169E1"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>

        {/* Standing wave visualization */}
        {isActive && standingWaves.map((wave, index) => {
          const waveAmplitude = wave.amplitude * Math.sin(time * wave.frequency * 0.01 + wave.phase);
          const points = [];

          // Generate wave points along the chamber length
          for (let i = 0; i <= 50; i++) {
            const x = (i / 50 - 0.5) * chamberDimensions.length * scale;
            const y = Math.sin((i / 50) * Math.PI * wave.nodes) * waveAmplitude * 0.2;
            points.push(new THREE.Vector3(x, y, 0));
          }

          return (
            <group key={wave.frequency}>
              {/* Wave line */}
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color="#32CD32"
                  transparent
                  opacity={0.8}
                  linewidth={2}
                />
              </line>

              {/* Nodes */}
              {Array.from({ length: wave.nodes }, (_, i) => {
                const x = (i / (wave.nodes - 1) - 0.5) * chamberDimensions.length * scale;
                return (
                  <mesh key={`node-${i}`} position={[x, 0, 0]}>
                    <sphereGeometry args={[0.05, 8, 6]} />
                    <meshStandardMaterial
                      color="#FF4500"
                      emissive="#FF4500"
                      emissiveIntensity={0.5}
                    />
                  </mesh>
                );
              })}

              {/* Antinodes */}
              {Array.from({ length: wave.antinodes }, (_, i) => {
                const x = ((i + 0.5) / wave.antinodes - 0.5) * chamberDimensions.length * scale;
                return (
                  <mesh key={`antinode-${i}`} position={[x, 0, 0]}>
                    <sphereGeometry args={[0.03, 8, 6]} />
                    <meshStandardMaterial
                      color="#FFD700"
                      emissive="#FFD700"
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}

        {/* Helmholtz cavity (Grotto) */}
        <group position={[0, -chamberDimensions.height * scale * 0.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 16, 12]} />
            <meshStandardMaterial
              color="#8A2BE2"
              transparent
              opacity={0.6}
              emissive="#8A2BE2"
              emissiveIntensity={isActive ? 0.3 : 0.1}
            />
          </mesh>

          {/* Cavity resonance indicator */}
          {isActive && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.6, 16, 12]} />
              <meshStandardMaterial
                color="#8A2BE2"
                transparent
                opacity={0.2}
                wireframe
              />
            </mesh>
          )}
        </group>
      </group>

      {/* Frequency Controls */}
      <group position={[3, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Frequency Control
        </Text>

        {standingWaves.map((wave, index) => (
          <group key={wave.frequency} position={[0, 1.5 - index * 0.6, 0]}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.15}
              color={selectedFrequency === wave.frequency ? "#FFD700" : "#32CD32"}
              anchorX="left"
              anchorY="middle"
            >
              {wave.frequency} Hz
            </Text>

            {/* Frequency button */}
            <mesh
              position={[1.5, 0, 0]}
              onClick={() => setSelectedFrequency(wave.frequency)}
            >
              <boxGeometry args={[0.3, 0.2, 0.1]} />
              <meshStandardMaterial
                color={selectedFrequency === wave.frequency ? "#FFD700" : "#4169E1"}
                emissive={selectedFrequency === wave.frequency ? "#FFD700" : "#4169E1"}
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Play/Stop button */}
        <group position={[0, -1, 0]}>
          <mesh onClick={() => setIsPlaying(!isPlaying)}>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial
              color={isPlaying ? "#FF4500" : "#32CD32"}
              emissive={isPlaying ? "#FF4500" : "#32CD32"}
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0.8, 0, 0]}
            fontSize={0.1}
            color="#ffe066"
            anchorX="left"
            anchorY="middle"
          >
            {isPlaying ? "Stop" : "Play"}
          </Text>
        </group>
      </group>

      {/* Time-of-Flight Measurements */}
      <group position={[-3, 0, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Time-of-Flight
        </Text>

        <div className="space-y-2">
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.12}
            color="#4169E1"
            anchorX="left"
            anchorY="middle"
          >
            Chamber Length: {chamberDimensions.length}m
          </Text>
          <Text
            position={[0, 1.3, 0]}
            fontSize={0.12}
            color="#4169E1"
            anchorX="left"
            anchorY="middle"
          >
            Speed of Sound: 343 m/s
          </Text>
          <Text
            position={[0, 1.1, 0]}
            fontSize={0.12}
            color="#32CD32"
            anchorX="left"
            anchorY="middle"
          >
            ToF: {((chamberDimensions.length / 343) * 1000).toFixed(1)} ms
          </Text>
        </div>

        {/* Harmonic series display */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="#ffe066"
          anchorX="center"
          anchorY="middle"
        >
          Harmonic Series
        </Text>
        {standingWaves.map((wave, index) => (
          <Text
            key={wave.frequency}
            position={[0, 0.2 - index * 0.15, 0]}
            fontSize={0.1}
            color="#32CD32"
            anchorX="left"
            anchorY="middle"
          >
            f{index + 1} = {wave.frequency} Hz (λ = {wave.wavelength.toFixed(2)}m)
          </Text>
        ))}
      </group>

      {/* Real-time Measurements */}
      {isActive && (
        <Html position={[0, 2, 0]} center>
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-700 shadow-lg min-w-64">
            <h3 className="text-lg font-bold text-[#ffe066] mb-2">Acoustic Measurements</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Current Frequency:</span>
                <span className="text-[#ffe066] font-mono">{selectedFrequency} Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Wavelength:</span>
                <span className="text-[#ffe066] font-mono">
                  {(343 / selectedFrequency).toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Standing Wave:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Helmholtz Cavity:</span>
                <span className="text-green-400">Resonant</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}