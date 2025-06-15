"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Settings, MessageCircle, User, Briefcase } from "lucide-react"
import type * as THREE from "three"

interface AssistantConfig {
  gender: "male" | "female"
  attire: "casual" | "executive"
  name: string
}

interface BusinessAssistantProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
}

// 3D Avatar Component
function Avatar({ config, isGreeting }: { config: AssistantConfig; isGreeting: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
      // Subtle rotation when greeting
      if (isGreeting) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
    }
  })

  // Color scheme based on attire
  const colors = {
    casual: {
      body: config.gender === "male" ? "#8B7355" : "#D4A574",
      clothing: "#4A90E2",
      accent: "#2E5BBA",
    },
    executive: {
      body: config.gender === "male" ? "#8B7355" : "#D4A574",
      clothing: "#1E293B",
      accent: "#EAB308",
    },
  }

  const currentColors = colors[config.attire]

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} ref={meshRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={currentColors.body} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 8]} />
        <meshStandardMaterial color={currentColors.clothing} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.4, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={currentColors.body} />
      </mesh>
      <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={currentColors.body} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={config.attire === "executive" ? "#1E293B" : "#2E5BBA"} />
      </mesh>
      <mesh position={[0.15, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color={config.attire === "executive" ? "#1E293B" : "#2E5BBA"} />
      </mesh>

      {/* Executive accessories */}
      {config.attire === "executive" && (
        <>
          {/* Tie */}
          <mesh position={[0, 1.0, 0.26]}>
            <boxGeometry args={[0.08, 0.4, 0.02]} />
            <meshStandardMaterial color={currentColors.accent} />
          </mesh>
          {/* Briefcase */}
          <mesh position={[0.6, 0.3, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </>
      )}

      {/* Name tag */}
      <Html position={[0, 2.2, 0]} center>
        <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-lg border text-xs font-medium">
          {config.name}
        </div>
      </Html>
    </group>
  )
}

// Assistant Messages Component
function AssistantMessages({ config }: { config: AssistantConfig }) {
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    `Hello! I'm ${config.name}, your AI business assistant.`,
    "I'm here to help you navigate the Agile Defense Systems platform.",
    "I can provide platform overviews, answer questions, and guide you through features.",
    "Feel free to customize my appearance and ask me anything!",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="flex items-start gap-2">
        <MessageCircle className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{messages[currentMessage]}</p>
      </div>
    </div>
  )
}

// Customization Panel
function CustomizationPanel({
  config,
  onConfigChange,
}: {
  config: AssistantConfig
  onConfigChange: (config: AssistantConfig) => void
}) {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-slate-900 rounded-lg border">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Customize Assistant
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Gender</label>
          <div className="flex gap-2 mt-1">
            <Button
              size="sm"
              variant={config.gender === "male" ? "default" : "outline"}
              onClick={() => onConfigChange({ ...config, gender: "male" })}
              className="flex-1"
            >
              <User className="h-3 w-3 mr-1" />
              Male
            </Button>
            <Button
              size="sm"
              variant={config.gender === "female" ? "default" : "outline"}
              onClick={() => onConfigChange({ ...config, gender: "female" })}
              className="flex-1"
            >
              <User className="h-3 w-3 mr-1" />
              Female
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Attire</label>
          <div className="flex gap-2 mt-1">
            <Button
              size="sm"
              variant={config.attire === "casual" ? "default" : "outline"}
              onClick={() => onConfigChange({ ...config, attire: "casual" })}
              className="flex-1"
            >
              Casual
            </Button>
            <Button
              size="sm"
              variant={config.attire === "executive" ? "default" : "outline"}
              onClick={() => onConfigChange({ ...config, attire: "executive" })}
              className="flex-1"
            >
              <Briefcase className="h-3 w-3 mr-1" />
              Executive
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Name</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
            className="w-full mt-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="Assistant name"
          />
        </div>
      </div>
    </div>
  )
}

export function BusinessAssistant({ isOpen, onClose, onToggle }: BusinessAssistantProps) {
  const [config, setConfig] = useState<AssistantConfig>({
    gender: "female",
    attire: "executive",
    name: "Alexandra",
  })
  const [showCustomization, setShowCustomization] = useState(false)
  const [isGreeting, setIsGreeting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsGreeting(true)
      const timer = setTimeout(() => setIsGreeting(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gold-500 hover:bg-gold-600 text-navy-900 shadow-executive z-50 animate-pulse-glow"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <Card className="relative w-full max-w-2xl h-[600px] executive-card">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowCustomization(!showCustomization)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Avatar Section */}
            <div className="relative">
              <div className="h-64 w-full avatar-container">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Avatar config={config} isGreeting={isGreeting} />
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      maxPolarAngle={Math.PI / 2}
                      minPolarAngle={Math.PI / 4}
                    />
                  </Suspense>
                </Canvas>
              </div>
              <AssistantMessages config={config} />
            </div>

            {/* Controls Section */}
            <div className="space-y-4">
              {showCustomization && <CustomizationPanel config={config} onConfigChange={setConfig} />}

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    Platform Overview
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Getting Started Guide
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
