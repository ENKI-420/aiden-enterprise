# AIDEN Tour System

A comprehensive, multi-role, persistent, self-healing onboarding engine for the AIDEN platform.

## Features

### 🎯 Multi-Role Support

- **Role Detection**: Automatically detects user role based on URL patterns and DOM elements
- **Role-Specific Tours**: Different tour flows for different user types (guest, developer, admin, clinician, researcher, executive)
- **Dynamic Content**: Tour content adapts based on user role and context

### 🔄 Persistent Progress

- **Local Storage**: Progress is saved and restored across sessions
- **Resume Capability**: Users can continue tours from where they left off
- **Completion Tracking**: Tracks completed and skipped steps

### 🛠️ Self-Healing

- **DOM Validation**: Automatically checks if tour targets exist
- **Alternative Steps**: Finds alternative steps when targets are missing
- **Recovery Logic**: Gracefully handles dynamic UI changes

### ⌨️ Hotkey Support

- **Global Hotkeys**: Escape to close, arrow keys to navigate
- **Step-Specific Hotkeys**: Custom hotkeys for individual steps
- **Keyboard Navigation**: Full keyboard accessibility

### 🎨 Professional UI

- **Smooth Animations**: CSS transitions and transforms
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatic theme adaptation
- **Professional Styling**: Non-cartoonish, enterprise-grade appearance

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { TourGuideProvider } from '@/components/tour';

function App() {
  return (
    <TourGuideProvider
      defaultRole="guest"
      autoStart={true}
      persistProgress={true}
      enableHotkeys={true}
      enableSelfHealing={true}
    >
      <YourApp />
    </TourGuideProvider>
  );
}
```

### 2. Add tour launcher (optional)

```tsx
import { TourLauncher } from '@/components/tour';

function YourComponent() {
  return (
    <div>
      <YourContent />
      <TourLauncher />
    </div>
  );
}
```

### 3. Add progress bar (optional)

```tsx
import { TourProgressBar } from '@/components/tour';

function YourComponent() {
  return (
    <div>
      <YourContent />
      <TourProgressBar />
    </div>
  );
}
```

## Configuration

### Tour Steps

Define tour steps in `tourConfig.ts`:

```tsx
export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    role: "guest",
    title: "Welcome to AIDEN",
    content: "Welcome to the Advanced Intelligence & Data Engineering Network.",
    position: "center",
    action: "none",
    autoAdvance: true,
    delay: 1000
  },
  {
    id: "navigation",
    role: "guest",
    title: "Navigation",
    content: "Use the navigation to explore different sections.",
    selector: "nav",
    position: "bottom",
    action: "hover"
  }
];
```

### Tour Flows

Define tour flows for different scenarios:

```tsx
export const TOUR_FLOWS: TourFlow[] = [
  {
    id: "first-time-user",
    name: "First Time User",
    description: "Complete onboarding for new users",
    roles: ["guest"],
    steps: ["welcome", "navigation"],
    autoStart: true,
    priority: 1
  }
];
```

## Usage Examples

### Basic Usage

```tsx
import { useTour } from '@/components/tour';

function MyComponent() {
  const { startTour, isActive, currentStep } = useTour();

  return (
    <div>
      <button onClick={() => startTour()}>Start Tour</button>
      {isActive && <p>Current step: {currentStep?.title}</p>}
    </div>
  );
}
```

### Role-Specific Tours

```tsx
import { useTour } from '@/components/tour';

function AdminDashboard() {
  const { startTour } = useTour();

  return (
    <div data-role="admin">
      <button onClick={() => startTour('admin-setup', 'admin')}>
        Start Admin Tour
      </button>
    </div>
  );
}
```

### Custom Tour Launcher

```tsx
import { RoleTourLauncher } from '@/components/tour';

function ClinicianPage() {
  return (
    <div>
      <YourContent />
      <RoleTourLauncher
        role="clinician"
        flowId="clinician-training"
      />
    </div>
  );
}
```

## API Reference

### TourGuideProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultRole` | `Role` | `'guest'` | Default user role |
| `autoStart` | `boolean` | `true` | Auto-start tour for new users |
| `persistProgress` | `boolean` | `true` | Save progress to localStorage |
| `enableHotkeys` | `boolean` | `true` | Enable keyboard navigation |
| `enableSelfHealing` | `boolean` | `true` | Enable self-healing features |

### useTour Hook

```tsx
const {
  // State
  isActive,
  currentStep,
  currentStepIndex,
  totalSteps,
  currentFlow,
  userRole,

  // Actions
  startTour,
  stopTour,
  nextStep,
  previousStep,
  skipStep,
  skipToStep,
  restartTour,

  // Utilities
  getProgress,
  isStepRequired,
  canSkipCurrentStep,
  canGoBack,
} = useTour();
```

### TourStep Interface

```tsx
interface TourStep {
  id: string;
  role: Role;
  title: string;
  content: string;
  anchor?: string;
  selector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'none';
  required?: boolean;
  skipIf?: string;
  autoAdvance?: boolean;
  delay?: number;
  hotkeys?: string[];
}
```

## Role Detection

The system automatically detects user roles based on:

1. **URL Patterns**:
   - `/admin` → `admin`
   - `/developer` or `/api` → `developer`
   - `/clinical` or `/patient` → `clinician`
   - `/research` or `/analytics` → `researcher`
   - `/executive` or `/dashboard` → `executive`

2. **DOM Elements**:
   - `[data-role="admin"]` → `admin`
   - `[data-role="developer"]` → `developer`
   - etc.

## Self-Healing Features

### Automatic Recovery

- Monitors DOM changes every 2 seconds
- Automatically finds alternative steps when targets are missing
- Gracefully skips invalid steps

### Validation

- Checks if target elements exist and are visible
- Validates step selectors before showing steps
- Provides fallback options for missing elements

## Hotkeys

### Global Hotkeys

- `Escape` - Close tour
- `Arrow Right` / `Space` - Next step
- `Arrow Left` - Previous step
- `S` - Skip current step

### Step-Specific Hotkeys

Define custom hotkeys for individual steps:

```tsx
{
  id: "live-reload",
  hotkeys: ["ctrl+r", "cmd+r"],
  // ... other properties
}
```

## Styling

The tour system uses Tailwind CSS and supports:

- **Dark Mode**: Automatic theme detection
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: CSS transitions and transforms
- **Professional Appearance**: Enterprise-grade styling

### Custom Styling

Override default styles by passing className props:

```tsx
<TourProgressBar className="custom-progress-bar" />
<TourLauncher className="custom-launcher" />
```

## Best Practices

### 1. Role-Specific Content

Always provide role-specific tour content that matches the user's actual needs.

### 2. Progressive Disclosure

Start with basic concepts and progressively introduce advanced features.

### 3. Skip Options

Allow users to skip non-essential steps, but mark critical steps as required.

### 4. Clear Selectors

Use specific, stable selectors that won't change frequently.

### 5. Meaningful Content

Provide helpful, actionable content that adds value to the user experience.

## Troubleshooting

### Tour Not Starting

- Check if `autoStart` is enabled
- Verify user hasn't completed the tour before
- Check browser console for errors

### Steps Not Showing

- Verify target elements exist in DOM
- Check selector syntax
- Ensure elements are visible

### Progress Not Saving

- Check if `persistProgress` is enabled
- Verify localStorage is available
- Check for browser privacy settings

## Contributing

When adding new tour steps or flows:

1. Follow the existing naming conventions
2. Add proper TypeScript types
3. Include role-appropriate content
4. Test with different user roles
5. Update this documentation

## License

This tour system is part of the AIDEN platform and follows the same licensing terms.
