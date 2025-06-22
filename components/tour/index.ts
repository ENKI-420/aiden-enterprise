// Main tour components
export { TourGuideProvider, useTour, useTourProgress } from './TourGuideProvider';
export { RoleTourLauncher, SimpleTourLauncher, default as TourLauncher } from './TourLauncher';
export { default as TourProgressBar, TourProgressCompact } from './TourProgressBar';
export { default as TourStep } from './TourStep';

// Configuration and types
export {
  getFlowForRole,
  getStepById,
  getStepsForFlow, getStepsForRole, TOUR_FLOWS, TOUR_STEPS
} from './tourConfig';
export type { Role, TourFlow, TourStep } from './tourConfig';

// Re-export for convenience
export { default as tourConfig } from './tourConfig';
