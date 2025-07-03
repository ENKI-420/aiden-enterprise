"use client";

import { OrbitControls, PointMaterial, Points } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Quantum Plasma Particles Component
function QuantumPlasmaField({ count = 8000 }) {
    const meshRef = useRef<THREE.Points>(null);
    const [positions, colors, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Create spherical distribution with quantum field effects
            const radius = Math.random() * 15 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Quantum plasma colors - blue to cyan with energy variations
            const energy = Math.random();
            colors[i * 3] = 0.1 + energy * 0.3; // Red
            colors[i * 3 + 1] = 0.4 + energy * 0.4; // Green  
            colors[i * 3 + 2] = 0.8 + energy * 0.2; // Blue

            sizes[i] = Math.random() * 2 + 0.5;
        }

        return [positions, colors, sizes];
    }, [count]);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;

            // Quantum field pulsation
            meshRef.current.rotation.y = time * 0.1;
            meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;

            // Update particle positions for quantum movement
            const positionAttr = meshRef.current.geometry.attributes.position;
            const colorAttr = meshRef.current.geometry.attributes.color;

            if (positionAttr && colorAttr) {
                const positions = positionAttr.array as Float32Array;
                const colors = colorAttr.array as Float32Array;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;

                    // Quantum fluctuation
                    if (positions[i3] !== undefined) {
                        positions[i3] += Math.sin(time + i * 0.01) * 0.002;
                        positions[i3 + 1] += Math.cos(time + i * 0.015) * 0.002;
                        positions[i3 + 2] += Math.sin(time * 0.5 + i * 0.02) * 0.001;
                    }

                    // Energy state fluctuation
                    const energy = (Math.sin(time + i * 0.1) + 1) * 0.5;
                    if (colors[i3] !== undefined) {
                        colors[i3] = 0.1 + energy * 0.3;
                        colors[i3 + 1] = 0.4 + energy * 0.4;
                        colors[i3 + 2] = 0.8 + energy * 0.2;
                    }
                }

                positionAttr.needsUpdate = true;
                colorAttr.needsUpdate = true;
            }
        }
    });

    return (
        <Points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <PointMaterial
                size={2}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Interdimensional Flag Component
function InterdimensionalFlag() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Create flag texture programmatically
    const flagTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 341; // Maintain flag aspect ratio
        const ctx = canvas.getContext('2d')!;

        // Draw American flag
        const stripeHeight = canvas.height / 13;

        // Red and white stripes
        for (let i = 0; i < 13; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#B22234' : '#FFFFFF';
            ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
        }

        // Blue canton
        const cantonWidth = canvas.width * 0.4;
        const cantonHeight = stripeHeight * 7;
        ctx.fillStyle = '#3C3B6E';
        ctx.fillRect(0, 0, cantonWidth, cantonHeight);

        // White stars (simplified - 50 stars)
        ctx.fillStyle = '#FFFFFF';
        const starSize = 8;
        for (let row = 0; row < 9; row++) {
            const starsInRow = row % 2 === 0 ? 6 : 5;
            const startX = row % 2 === 0 ? 25 : 50;
            for (let col = 0; col < starsInRow; col++) {
                const x = startX + col * 40;
                const y = 15 + row * 18;
                ctx.fillRect(x - starSize / 2, y - starSize / 2, starSize, starSize);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, []);

    // Quantum shader material for interdimensional effects
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                flagTexture: { value: flagTexture },
                opacity: { value: 0.9 }
            },
            vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Wave motion
          vec3 pos = position;
          pos.z += sin(pos.x * 2.0 + time) * 0.1;
          pos.z += cos(pos.y * 3.0 + time * 1.2) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        uniform sampler2D flagTexture;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec4 flagColor = texture2D(flagTexture, vUv);
          
          // Interdimensional shimmer effect
          float shimmer = sin(time * 2.0 + vPosition.x * 10.0) * 0.2 + 0.8;
          
          // Quantum phase shift
          float phase = sin(time + vPosition.y * 5.0) * 0.1 + 0.9;
          
          vec3 finalColor = flagColor.rgb * shimmer * phase;
          
          // Add cyan energy edges
          float edge = smoothstep(0.1, 0.3, abs(vUv.x - 0.5)) * 
                      smoothstep(0.1, 0.3, abs(vUv.y - 0.5));
          finalColor += vec3(0.0, 0.8, 1.0) * edge * 0.3;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide
        });
    }, [flagTexture]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} material={shaderMaterial}>
            <planeGeometry args={[4, 2.6, 32, 32]} />
            <primitive object={shaderMaterial} ref={materialRef} attach="material" />
        </mesh>
    );
}

// Dimensional Tetrahedron
function DimensionalTetrahedron() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, -2, 0]}>
            <tetrahedronGeometry args={[1.5, 0]} />
            <meshBasicMaterial
                color="#00FFFF"
                wireframe
                transparent
                opacity={0.3}
            />
        </mesh>
    );
}

// Neural Network Connections
function NeuralConnections() {
    const linesRef = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const points = [];
        const colors = [];

        // Create network connections
        for (let i = 0; i < 200; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );

            points.push(start.x, start.y, start.z);
            points.push(end.x, end.y, end.z);

            // Cyan neural connections
            colors.push(0, 0.8, 1, 0, 0.8, 1);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        return geometry;
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial
                vertexColors
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}

// Main 3D Scene
function Scene() {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FFFF" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0EA5E9" />

            <QuantumPlasmaField />
            <InterdimensionalFlag />
            <DimensionalTetrahedron />
            <NeuralConnections />

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </>
    );
}

// Loading fallback
function LoadingFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-cyan-400 text-sm">Initializing Quantum Field...</p>
            </div>
        </div>
    );
}

// Main Component
export default function ParticleBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 75 }}
                    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
                >
                    <Scene />
                </Canvas>
            </Suspense>

            {/* Overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        </div>
    );
}
