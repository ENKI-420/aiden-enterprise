# Aiden Engine Onboarding System

A comprehensive, multi-role, persistent, self-healing onboarding engine with recursive step advancement, role-aware flows, persistent progress, hotkey-driven advancement, and SSR-safe integration for Next.js and Framer Motion.

## 🚀 Features

### Core Capabilities

- **Multi-Role Support**: Guest, Developer, Admin, Clinician, Researcher, Executive
- **Persistent Progress**: Save and resume across sessions
- **Role-Aware Flows**: Different experiences based on user context
- **Hotkey Navigation**: Keyboard shortcuts for tour control
- **SSR-Safe**: Works with Next.js server-side rendering
- **Auto-Advance**: Configurable automatic step progression
- **Conditional Logic**: Smart step skipping and branching
- **Interactive Elements**: Rich step content with animations
- **Progress Tracking**: Visual progress indicators
- **Self-Healing**: Automatic recovery from errors

### Advanced Features

- **Recursive Step Advancement**: Complex flow logic with conditional branching
- **Flow Unlocking**: Steps can unlock new tour flows
- **Insights Collection**: Gather user interaction data
- **Contextual Triggers**: Role and page-aware tour triggers
- **Floating Elements**: Non-intrusive tour indicators
- **Professional UI**: Non-cartoonish, enterprise-grade design

## 📁 Architecture

```
components/
├── TourProvider.tsx          # Global tour state management
├── TourEngine.tsx            # Main tour engine logic
├── TourEngineWrapper.tsx     # SSR-safe wrapper component
├── TourStep.tsx              # Individual step rendering
├── TourTrigger.tsx           # Tour trigger components
└── tourConfig.ts             # Tour configuration and flows

lib/
└── tourConfig.ts             # Tour configuration types and data
```

## 🛠️ Installation & Setup

### 1. Provider Setup

Wrap your app with the `TourProvider` in your root layout:

```tsx
// app/layout.tsx
import { TourProvider } from '@/components/TourProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TourProvider autoStart={true}>
          {children}
        </TourProvider>
      </body>
    </html>
  );
}
```

### 2. Engine Integration

Add the `TourEngineWrapper` to your pages:

```tsx
// app/page.tsx
import TourEngineWrapper from '@/components/TourEngineWrapper';

export default function HomePage() {
  return (
    <>
      <TourEngineWrapper />
      {/* Your page content */}
    </>
  );
}
```

### 3. Tour Triggers

Use tour triggers throughout your application:

```tsx
import { TourTrigger, DeveloperTourTrigger } from '@/components/TourTrigger';

// Basic trigger
<TourTrigger variant="button" tooltip="Start tour" />

// Role-specific trigger
<DeveloperTourTrigger variant="icon" />

// Contextual trigger
<ContextualTourTrigger />
```

## ⚙️ Configuration

### Tour Configuration

Define tour steps and flows in `lib/tourConfig.ts`:

```typescript
export const tourConfig = {
  roles: {
    guest: {
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to Aiden',
          content: 'Discover our AI-powered platform',
          position: 'center',
          required: true,
          autoAdvance: 5000,
        },
        // ... more steps
      ],
      flows: {
        advanced: {
          name: 'Advanced Features',
          steps: [
            // Advanced tour steps
          ],
        },
      },
    },
    // ... other roles
  },
};
```

### Step Configuration Options

```typescript
interface TourStep {
  id: string;                    // Unique identifier
  title: string;                 // Step title
  content: string | ReactNode;   // Step content
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  target?: string;               // CSS selector for highlighting
  required?: boolean;            // Must complete to proceed
  autoAdvance?: number;          // Auto-advance after milliseconds
  skipCondition?: (progress: any, insights: any) => boolean;
  conditionalNext?: (progress: any, insights: any) => string | null;
  unlocksFlow?: string;          // Flow to unlock after completion
  onComplete?: () => any;        // Completion callback
  interactive?: boolean;         // Allow user interaction
  hotkeys?: string[];            // Custom hotkeys for this step
}
```

## 🎮 Usage Examples

### Basic Tour Trigger

```tsx
import TourTrigger from '@/components/TourTrigger';

<TourTrigger
  role="developer"
  variant="button"
  tooltip="Start developer tour"
  showProgress
/>
```

### Role-Specific Triggers

```tsx
import {
  DeveloperTourTrigger,
  AdminTourTrigger,
  ClinicianTourTrigger
} from '@/components/TourTrigger';

<DeveloperTourTrigger variant="icon" />
<AdminTourTrigger variant="button" />
<ClinicianTourTrigger variant="inline" />
```

### Advanced Triggers

```tsx
import {
  ContextualTourTrigger,
  FloatingTourTrigger
} from '@/components/TourTrigger';

// Automatically detects role based on current page
<ContextualTourTrigger />

// Appears on first visit
<FloatingTourTrigger />
```

### Programmatic Control

```tsx
import { useTourActions, useTourState } from '@/components/TourProvider';

function MyComponent() {
  const { startTour, stopTour, restartTour } = useTourActions();
  const { isActive, currentRole } = useTourState();

  const handleStartDeveloperTour = () => {
    startTour('developer', 'advanced');
  };

  return (
    <div>
      <button onClick={handleStartDeveloperTour}>
        Start Developer Tour
      </button>
      {isActive && <span>Tour active for {currentRole}</span>}
    </div>
  );
}
```

## ⌨️ Hotkeys

The tour system supports comprehensive keyboard navigation:

| Hotkey | Action |
|--------|--------|
| `Alt + →` or `Alt + l` | Next step |
| `Alt + ←` or `Alt + h` | Previous step |
| `Alt + Space` | Pause/Resume tour |
| `Alt + s` | Skip current step |
| `Alt + r` | Restart tour |
| `Alt + Esc` | Pause tour |
| `Alt` (hold) | Show hotkey help |

## 🎨 Customization

### Custom Step Content

```tsx
// In tourConfig.ts
{
  id: 'custom-step',
  title: 'Custom Step',
  content: (
    <div className="custom-step-content">
      <h3>Custom Title</h3>
      <p>Custom content with React components</p>
      <button onClick={handleAction}>Custom Action</button>
    </div>
  ),
  position: 'center',
  interactive: true,
}
```

### Custom Styling

```css
/* Custom tour step styles */
.tour-step {
  background: linear-gradient(135deg, #0EA5E9, #10B981);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.tour-step-highlight {
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.5);
  border-radius: 8px;
}
```

### Custom Animations

```tsx
// Custom step animations
{
  id: 'animated-step',
  title: 'Animated Step',
  content: 'Content with custom animations',
  animations: {
    enter: { scale: 0.8, opacity: 0 },
    exit: { scale: 1.2, opacity: 0 },
  },
}
```

## 🔧 Advanced Configuration

### Conditional Logic

```typescript
{
  id: 'conditional-step',
  title: 'Conditional Step',
  content: 'This step may be skipped',
  skipCondition: (progress, insights) => {
    return progress.userType === 'expert';
  },
  conditionalNext: (progress, insights) => {
    if (insights.userPreference === 'advanced') {
      return 'advanced-features';
    }
    return null; // Continue to next step
  },
}
```

### Flow Unlocking

```typescript
{
  id: 'unlock-advanced',
  title: 'Unlock Advanced Features',
  content: 'You can now access advanced features',
  unlocksFlow: 'advanced',
  onComplete: () => {
    // Trigger advanced flow unlock
    return { unlockedAdvanced: true };
  },
}
```

### Progress Tracking

```typescript
// Custom progress tracking
const handleTourComplete = (insights) => {
  console.log('Tour completed with insights:', insights);

  // Send analytics
  analytics.track('tour_completed', {
    role: insights.role,
    stepsCompleted: insights.stepsCompleted,
    timeSpent: insights.timeSpent,
  });
};
```

## 🚀 Deployment

### Production Considerations

1. **Performance**: Tour components are lazy-loaded and optimized
2. **Accessibility**: Full keyboard navigation and screen reader support
3. **Mobile**: Responsive design with touch-friendly interactions
4. **Analytics**: Built-in progress tracking and insights collection
5. **Error Handling**: Graceful fallbacks and error recovery

### Environment Variables

```env
# Optional: Disable tours in production
NEXT_PUBLIC_DISABLE_TOURS=false

# Optional: Custom tour endpoint
NEXT_PUBLIC_TOUR_API_URL=https://api.example.com/tours
```

## 📊 Analytics & Insights

The tour system automatically collects insights:

```typescript
interface TourInsights {
  role: UserRole;
  stepsCompleted: string[];
  timeSpent: number;
  interactions: Record<string, any>;
  preferences: Record<string, any>;
  completionRate: number;
  skippedSteps: string[];
}
```

## 🔮 Future Enhancements

### Planned Features

- **AI-Driven Tours**: Dynamic tour generation based on user behavior
- **Telemetry Integration**: Advanced analytics and user behavior tracking
- **Server Persistence**: Cloud-based progress synchronization
- **Multi-Language**: Internationalization support
- **A/B Testing**: Tour variant testing and optimization
- **Voice Navigation**: Voice-controlled tour navigation

### Extension Points

- **Custom Step Types**: Plugin system for custom step components
- **External Integrations**: Third-party tool integrations
- **Advanced Analytics**: Custom analytics and reporting
- **Tour Templates**: Reusable tour configurations

## 🤝 Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Visit `/tour-demo` to test the onboarding system

### Testing

```bash
# Run tour system tests
npm run test:tour

# Run integration tests
npm run test:integration

# Run accessibility tests
npm run test:a11y
```

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add comprehensive JSDoc comments
- Follow accessibility guidelines

## 📄 License

This onboarding engine is part of the Aiden Engine platform and follows the same licensing terms.

## 🆘 Support

For questions, issues, or contributions:

1. Check the [documentation](docs/)
2. Review [existing issues](issues/)
3. Create a [new issue](issues/new)
4. Join our [community](community/)

---

**Built with ❤️ by the Aiden Engine Team**
