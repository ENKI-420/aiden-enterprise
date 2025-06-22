"use client";

import TourEngineWrapper from '@/components/TourEngineWrapper';
import { useTourActions, useTourState } from '@/components/TourProvider';
import TourTrigger, {
    AdminTourTrigger,
    ClinicianTourTrigger,
    ContextualTourTrigger,
    DeveloperTourTrigger,
    ExecutiveTourTrigger,
    FloatingTourTrigger,
    GuestTourTrigger,
    ResearcherTourTrigger
} from '@/components/TourTrigger';
import { UserRole } from '@/lib/tourConfig';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TourDemoPage() {
  const { startTour, restartTour, stopTour, setUserRole } = useTourActions();
  const { isActive, currentRole, isPaused } = useTourState();
  const [selectedRole, setSelectedRole] = useState<UserRole>('guest');

  const roles: { value: UserRole; label: string; description: string; color: string }[] = [
    { value: 'guest', label: 'Guest', description: 'New user introduction', color: 'bg-gray-500' },
    { value: 'developer', label: 'Developer', description: 'Technical features tour', color: 'bg-blue-500' },
    { value: 'admin', label: 'Admin', description: 'Administrative tools tour', color: 'bg-red-500' },
    { value: 'clinician', label: 'Clinician', description: 'Healthcare workflow tour', color: 'bg-green-500' },
    { value: 'researcher', label: 'Researcher', description: 'Research features tour', color: 'bg-purple-500' },
    { value: 'executive', label: 'Executive', description: 'Executive dashboard tour', color: 'bg-yellow-500' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setUserRole(role);
  };

  const handleStartTour = () => {
    startTour(selectedRole);
  };

  return (
    <>
      <TourEngineWrapper />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Aiden Engine Tour System
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive onboarding engine with role-aware flows, persistent progress, and advanced interactions
            </p>

            {/* Current Status */}
            <div className="inline-flex items-center space-x-4 bg-black/20 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-white">
                  {isActive ? 'Tour Active' : 'Tour Inactive'}
                </span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-white">
                Role: <span className="font-semibold capitalize">{currentRole}</span>
              </div>
              {isActive && (
                <>
                  <div className="text-gray-400">|</div>
                  <div className="text-white">
                    Status: <span className="font-semibold">{isPaused ? 'Paused' : 'Running'}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Select User Role</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${role.color} mx-auto mb-2`} />
                  <div className="text-white font-semibold text-sm">{role.label}</div>
                  <div className="text-gray-400 text-xs text-center">{role.description}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tour Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tour Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartTour}
                disabled={isActive}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Tour
              </button>
              <button
                onClick={restartTour}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Restart Tour
              </button>
              <button
                onClick={stopTour}
                disabled={!isActive}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stop Tour
              </button>
            </div>
          </motion.div>

          {/* Tour Triggers Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tour Triggers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Basic Triggers */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Basic Triggers</h3>
                <div className="space-y-3">
                  <TourTrigger variant="button" tooltip="Standard tour trigger" />
                  <TourTrigger variant="icon" tooltip="Icon-based trigger" />
                  <TourTrigger variant="inline" tooltip="Inline text trigger" />
                </div>
              </div>

              {/* Role-Specific Triggers */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Role-Specific Triggers</h3>
                <div className="space-y-3">
                  <GuestTourTrigger variant="button" size="sm" />
                  <DeveloperTourTrigger variant="button" size="sm" />
                  <AdminTourTrigger variant="button" size="sm" />
                  <ClinicianTourTrigger variant="button" size="sm" />
                  <ResearcherTourTrigger variant="button" size="sm" />
                  <ExecutiveTourTrigger variant="button" size="sm" />
                </div>
              </div>

              {/* Advanced Triggers */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Triggers</h3>
                <div className="space-y-3">
                  <ContextualTourTrigger />
                  <TourTrigger
                    variant="button"
                    flow="advanced"
                    tooltip="Advanced flow tour"
                    showProgress
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Demo Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Interactive Demo Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Coding Suite</h3>
                  <p className="text-gray-300 mb-4">Advanced development environment with AI assistance</p>
                  <TourTrigger variant="inline" tooltip="Learn about AI coding features" />
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Project Spectra</h3>
                  <p className="text-gray-300 mb-4">3D pyramid physics simulation and research</p>
                  <TourTrigger variant="inline" tooltip="Explore research capabilities" />
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Healthcare Platform</h3>
                  <p className="text-gray-300 mb-4">HIPAA-compliant clinical workflow automation</p>
                  <TourTrigger variant="inline" tooltip="Discover healthcare features" />
                </div>
              </div>

              {/* Control Panel */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Control Panel</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-start tours</span>
                    <TourTrigger variant="icon" size="sm" tooltip="Configure auto-start" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Progress tracking</span>
                    <TourTrigger variant="icon" size="sm" tooltip="View progress" showProgress />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Hotkey help</span>
                    <TourTrigger variant="icon" size="sm" tooltip="Show hotkeys" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Role switching</span>
                    <TourTrigger variant="icon" size="sm" tooltip="Change role" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tour System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Role-Aware Flows</h3>
                <p className="text-gray-300 text-sm">Different tour experiences based on user role and context</p>
              </div>

              <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Persistent Progress</h3>
                <p className="text-gray-300 text-sm">Save and resume tour progress across sessions</p>
              </div>

              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Hotkey Navigation</h3>
                <p className="text-gray-300 text-sm">Keyboard shortcuts for tour navigation and control</p>
              </div>

              <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">SSR-Safe Integration</h3>
                <p className="text-gray-300 text-sm">Works seamlessly with Next.js and server-side rendering</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Tour Trigger */}
          <FloatingTourTrigger />
        </div>
      </div>
    </>
  );
}