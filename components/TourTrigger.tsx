"use client";

import { UserRole } from '@/lib/tourConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTourActions } from './TourProvider';

interface TourTriggerProps {
  role?: UserRole;
  flow?: string;
  variant?: 'button' | 'icon' | 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  tooltip?: string;
  autoStart?: boolean;
  showProgress?: boolean;
}

export default function TourTrigger({
  role,
  flow,
  variant = 'button',
  size = 'md',
  className = '',
  children,
  tooltip,
  autoStart = false,
  showProgress = false
}: TourTriggerProps) {
  const { startTour } = useTourActions();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    startTour(role, flow);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'icon':
        return 'p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors';
      case 'floating':
        return 'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110';
      case 'inline':
        return 'text-blue-600 hover:text-blue-800 underline cursor-pointer';
      default:
        return `bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${getSizeClasses()}`;
    }
  };

  const renderContent = () => {
    if (children) return children;

    switch (variant) {
      case 'icon':
        return '🎯';
      case 'floating':
        return '🎯';
      case 'inline':
        return 'Start Tour';
      default:
        return 'Start Tour';
    }
  };

  const renderTooltip = () => {
    if (!tooltip) return null;

    return (
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute z-50 px-3 py-2 bg-black text-white text-xs rounded-lg whitespace-nowrap ${
              variant === 'floating' ? 'bottom-full right-0 mb-2' : 'top-full left-1/2 -translate-x-1/2 mt-2'
            }`}
          >
            {tooltip}
            <div className={`absolute w-2 h-2 bg-black transform rotate-45 ${
              variant === 'floating' ? 'top-full right-2 -mt-1' : 'bottom-full left-1/2 -translate-x-1/2 -mb-1'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderProgress = () => {
    if (!showProgress) return null;

    const progress = localStorage.getItem('tourProgress');
    const completed = progress ? Object.keys(JSON.parse(progress)).length : 0;
    const total = 5; // Approximate total steps

    return (
      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {completed}/{total}
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (tooltip) {
            setTimeout(() => setShowTooltip(true), 500);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip(false);
        }}
        className={`${getVariantClasses()} ${className} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
        aria-label={tooltip || 'Start tour'}
      >
        {renderContent()}
        {renderProgress()}
      </button>
      {renderTooltip()}
    </div>
  );
}

// Specialized tour triggers for different roles
export function GuestTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="guest" {...props} />;
}

export function DeveloperTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="developer" {...props} />;
}

export function AdminTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="admin" {...props} />;
}

export function ClinicianTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="clinician" {...props} />;
}

export function ResearcherTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="researcher" {...props} />;
}

export function ExecutiveTourTrigger(props: Omit<TourTriggerProps, 'role'>) {
  return <TourTrigger role="executive" {...props} />;
}

// Floating tour trigger that appears on first visit
export function FloatingTourTrigger() {
  const [hasShown, setHasShown] = useState(false);

  // Check if this is the first visit
  if (typeof window !== 'undefined') {
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    if (visitCount === 0 && !hasShown) {
      setHasShown(true);
    }
  }

  if (hasShown) return null;

  return (
    <TourTrigger
      variant="floating"
      size="lg"
      tooltip="Welcome! Start your personalized tour"
      showProgress
    />
  );
}

// Context-aware tour trigger that adapts to the current page
export function ContextualTourTrigger() {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');

  // Detect role based on current page
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.includes('/admin')) setCurrentRole('admin');
    else if (pathname.includes('/developer')) setCurrentRole('developer');
    else if (pathname.includes('/medical')) setCurrentRole('clinician');
    else if (pathname.includes('/research')) setCurrentRole('researcher');
    else if (pathname.includes('/executive')) setCurrentRole('executive');
  }

  const getTooltip = () => {
    switch (currentRole) {
      case 'admin':
        return 'Admin dashboard tour';
      case 'developer':
        return 'Developer tools tour';
      case 'clinician':
        return 'Clinical workflow tour';
      case 'researcher':
        return 'Research features tour';
      case 'executive':
        return 'Executive dashboard tour';
      default:
        return 'Welcome tour';
    }
  };

  return (
    <TourTrigger
      role={currentRole}
      variant="button"
      tooltip={getTooltip()}
      showProgress
    />
  );
}