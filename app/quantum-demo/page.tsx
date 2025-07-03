"use client";

import EnhancedNavigationLayout from '@/components/EnhancedNavigationLayout';
import ParticleBackground from '@/components/ParticleBackground';
import QuantumThemeProvider, { useQuantumTheme } from '@/components/QuantumThemeProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRightIcon,
    BeakerIcon,
    BoltIcon,
    CommandLineIcon,
    CpuChipIcon,
    EyeIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function QuantumDemoContent() {
    const { currentTheme, applyQuantumEffect, generateQuantumGradient } = useQuantumTheme();
    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Apply quantum effects to elements
        if (cardRef.current) {
            applyQuantumEffect(cardRef.current, 'glow');
        }
        if (buttonRef.current) {
            applyQuantumEffect(buttonRef.current, 'pulse');
        }
    }, [applyQuantumEffect]);

    const features = [
        {
            icon: <BeakerIcon className="w-8 h-8" />,
            title: "Quantum Plasma Field",
            description: "8000+ dynamic particles with quantum field effects and energy fluctuations",
            color: "from-cyan-400 to-blue-500"
        },
        {
            icon: <CpuChipIcon className="w-8 h-8" />,
            title: "Neural Network Visualization",
            description: "Real-time neural connections with additive blending and dimensional rotation",
            color: "from-purple-400 to-indigo-500"
        },
        {
            icon: <BoltIcon className="w-8 h-8" />,
            title: "Interdimensional Flag",
            description: "American flag with quantum shader effects, waving through dimensional space",
            color: "from-red-400 to-orange-500"
        },
        {
            icon: <EyeIcon className="w-8 h-8" />,
            title: "Enhanced Navigation",
            description: "Adaptive sidebar with search, keyboard shortcuts, and quantum-themed UI",
            color: "from-emerald-400 to-teal-500"
        }
    ];

    const demoActions = [
        {
            title: "⌘ + K",
            description: "Open navigation search",
            action: () => {
                const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    metaKey: true
                });
                document.dispatchEvent(event);
            }
        },
        {
            title: "Mouse Drag",
            description: "Rotate 3D quantum field",
            action: () => {
                // This is handled by OrbitControls in the background
            }
        },
        {
            title: "Theme Switch",
            description: "Toggle quantum themes",
            action: () => {
                // This would switch themes if multiple were available
            }
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Quantum Background */}
            <div className="fixed inset-0 z-0">
                <ParticleBackground />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <div className="mb-6">
                            <SparklesIcon className="w-16 h-16 mx-auto text-cyan-400 quantum-pulse" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 quantum-text">
                            Quantum Navigation System
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                            Experience the future of enterprise UI with quantum-enhanced 3D backgrounds,
                            interdimensional physics simulations, and neural network visualizations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                ref={buttonRef}
                                className="quantum-button px-8 py-4 text-lg"
                                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            >
                                Explore Features
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 text-lg"
                                onClick={() => window.open('/project-spectra', '_blank')}
                            >
                                View Project Spectra
                                <BeakerIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            >
                                <Card className="quantum-card h-full">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-white text-lg">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-400">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Interactive Demo Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            Interactive Controls
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {demoActions.map((action, index) => (
                                <Card
                                    key={action.title}
                                    className="quantum-card cursor-pointer transition-all duration-300 hover:scale-105"
                                    onClick={action.action}
                                >
                                    <CardContent className="p-6 text-center">
                                        <kbd className="px-3 py-2 text-sm font-mono bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 mb-3 inline-block">
                                            {action.title}
                                        </kbd>
                                        <p className="text-gray-300 text-sm">
                                            {action.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Technical Specifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card ref={cardRef} className="quantum-card">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white flex items-center">
                                    <CommandLineIcon className="w-6 h-6 mr-3 text-cyan-400" />
                                    Technical Implementation
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Built with cutting-edge web technologies for maximum performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-cyan-300 mb-2">3D Rendering</h4>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            <li>• React Three Fiber & Three.js</li>
                                            <li>• Quantum shader materials</li>
                                            <li>• Real-time particle systems</li>
                                            <li>• OrbitControls for interaction</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-cyan-300 mb-2">UI Framework</h4>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            <li>• Next.js 14 with App Router</li>
                                            <li>• Framer Motion animations</li>
                                            <li>• Tailwind CSS with custom utilities</li>
                                            <li>• TypeScript for type safety</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-cyan-300 mb-2">Performance</h4>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            <li>• Hardware-accelerated rendering</li>
                                            <li>• Optimized particle count</li>
                                            <li>• Responsive design patterns</li>
                                            <li>• Lazy loading & code splitting</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-cyan-300 mb-2">Features</h4>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            <li>• Quantum theme system</li>
                                            <li>• Keyboard navigation shortcuts</li>
                                            <li>• Mobile responsive design</li>
                                            <li>• Accessibility compliance</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Footer Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="text-center mt-16 grid md:grid-cols-4 gap-8"
                    >
                        {[
                            { number: "8,000+", label: "Quantum Particles" },
                            { number: "200+", label: "Neural Connections" },
                            { number: "60 FPS", label: "Smooth Animation" },
                            { number: "∞", label: "Possibilities" }
                        ].map((stat, index) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold quantum-text mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function QuantumDemo() {
    return (
        <QuantumThemeProvider>
            <EnhancedNavigationLayout>
                <QuantumDemoContent />
            </EnhancedNavigationLayout>
        </QuantumThemeProvider>
    );
} 