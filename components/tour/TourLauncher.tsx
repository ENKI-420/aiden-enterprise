"use client";

import { Button } from '@/components/ui/button';
import { ChevronDown, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Role, TOUR_FLOWS } from './tourConfig';

interface TourLauncherProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showAvailableTours?: boolean;
  className?: string;
}

export default function TourLauncher({
  position = 'bottom-right',
  showAvailableTours = true,
  className = ''
}: TourLauncherProps) {
  const { isActive, startTour } = useTourGuide();
  const userRole = 'guest' as Role;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(userRole);
  const launcherRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available tours for current role
  const availableTours = TOUR_FLOWS.filter(flow =>
    flow.roles.includes(selectedRole)
  );

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const handleStartTour = (flowId?: string) => {
    // For now, start with empty steps array - this would be populated from tour config
    startTour([]);
    setIsOpen(false);
  };

  if (isActive) return null;

  return (
    <div ref={launcherRef} className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      {/* Main launcher button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3"
        size="lg"
      >
        <Play size={20} />
        {showAvailableTours && (
          <ChevronDown
            size={16}
            className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </Button>

      {/* Tour options dropdown */}
      {isOpen && showAvailableTours && (
        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-64">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Start Tour</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close tour launcher"
            >
              <X size={16} />
            </button>
          </div>

          {/* Role selector */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              aria-label="Select user role for tour"
            >
              <option value="guest">Guest</option>
              <option value="developer">Developer</option>
              <option value="admin">Administrator</option>
              <option value="clinician">Clinician</option>
              <option value="researcher">Researcher</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Available tours */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Tours
            </h4>
            {availableTours.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tours available for this role.
              </p>
            ) : (
              <div className="space-y-2">
                {availableTours.map((tour) => (
                  <button
                    key={tour.id}
                    onClick={() => handleStartTour(tour.id)}
                    className="w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {tour.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tour.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick start button */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => handleStartTour()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={availableTours.length === 0}
            >
              Start Recommended Tour
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple launcher without dropdown
export function SimpleTourLauncher({ className = '' }: { className?: string }) {
  const { isActive, startTour } = useTourGuide();

  if (isActive) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Button
        onClick={() => startTour([])}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3"
        size="lg"
        title="Start tour"
      >
        <Play size={20} />
      </Button>
    </div>
  );
}

// Role-specific launcher
export function RoleTourLauncher({
  role,
  flowId,
  className = ''
}: {
  role: Role;
  flowId?: string;
  className?: string;
}) {
  const { isActive, startTour } = useTourGuide();

  if (isActive) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Button
        onClick={() => startTour([])}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3"
        size="lg"
        title={`Start ${role} tour`}
      >
        <Play size={20} />
      </Button>
    </div>
  );
}