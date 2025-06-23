export type UserRole = 'guest' | 'researcher' | 'physician' | 'admin' | 'healthcare_professional';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  autoAdvance?: number;
  onComplete?: () => any;
  unlocksFlow?: string;
  conditionalNext?: (progress: Record<string, any>, insights: any) => string | null;
  hotkeys?: string[];
  requiresInteraction?: boolean;
  skipIf?: (progress: Record<string, any>, insights: any) => boolean;
}

export interface TourFlow {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  prerequisites?: string[];
  unlockCondition?: (progress: Record<string, any>, insights: any) => boolean;
}

export interface RoleConfig {
  steps: TourStep[];
  flows: Record<string, TourFlow>;
  defaultFlow?: string;
  hotkeys: {
    next: string;
    previous: string;
    pause: string;
    skip: string;
    restart: string;
  };
}

export interface TourConfig {
  roles: Record<UserRole, RoleConfig>;
  globalHotkeys: {
    show: string;
    hide: string;
  };
}

export const tourConfig: TourConfig = {
  roles: {
    guest: {
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to AIDEN Enterprise',
          content: 'Discover our AI-driven platform for healthcare and defense automation.',
          position: 'center',
          autoAdvance: 3000,
        },
        {
          id: 'navigation',
          title: 'Navigation',
          content: 'Use the sidebar to navigate between different modules and features.',
          target: '[data-tour="navigation"]',
          position: 'right',
          requiresInteraction: true,
        },
        {
          id: 'ai-features',
          title: 'AI Features',
          content: 'Explore our advanced AI capabilities including multi-modal processing and real-time analytics.',
          target: '[data-tour="ai-features"]',
          position: 'bottom',
        },
      ],
      flows: {
        basic: {
          id: 'basic',
          name: 'Basic Introduction',
          description: 'Essential features for new users',
          steps: [
            {
              id: 'basic-welcome',
              title: 'Welcome',
              content: 'Let\'s get you started with the basics.',
              position: 'center',
            },
            {
              id: 'basic-navigation',
              title: 'Navigation Basics',
              content: 'Learn how to move around the platform.',
              target: '[data-tour="navigation"]',
              position: 'right',
            },
          ],
        },
      },
      hotkeys: {
        next: 'Alt + →',
        previous: 'Alt + ←',
        pause: 'Alt + Space',
        skip: 'Alt + S',
        restart: 'Alt + R',
      },
    },
    researcher: {
      steps: [
        {
          id: 'research-welcome',
          title: 'Research Tools',
          content: 'Access advanced research capabilities including 3D visualization and physics simulation.',
          position: 'center',
        },
        {
          id: 'project-spectra',
          title: 'Project Spectra',
          content: 'Explore pyramid research and physics simulation tools.',
          target: '[data-tour="project-spectra"]',
          position: 'bottom',
          unlocksFlow: 'spectra-advanced',
        },
        {
          id: 'experiments',
          title: 'Experiments',
          content: 'Design and run research experiments with AI assistance.',
          target: '[data-tour="experiments"]',
          position: 'left',
        },
      ],
      flows: {
        'spectra-advanced': {
          id: 'spectra-advanced',
          name: 'Advanced Spectra Analysis',
          description: 'Deep dive into pyramid research tools',
          steps: [
            {
              id: 'spectra-3d',
              title: '3D Visualization',
              content: 'Explore the Great Pyramid in 3D with interactive controls.',
              target: '[data-tour="spectra-3d"]',
              position: 'top',
            },
            {
              id: 'spectra-physics',
              title: 'Physics Simulation',
              content: 'Run energy flow and scalar wave analysis simulations.',
              target: '[data-tour="spectra-physics"]',
              position: 'bottom',
            },
            {
              id: 'spectra-materials',
              title: 'Materials Analysis',
              content: 'Analyze crystal resonance and material properties.',
              target: '[data-tour="spectra-materials"]',
              position: 'right',
            },
          ],
          unlockCondition: (progress, insights) => progress['project-spectra'] === 'completed',
        },
      },
      hotkeys: {
        next: 'Alt + →',
        previous: 'Alt + ←',
        pause: 'Alt + Space',
        skip: 'Alt + S',
        restart: 'Alt + R',
      },
    },
    physician: {
      steps: [
        {
          id: 'clinical-welcome',
          title: 'Clinical Workflow',
          content: 'Streamline your clinical practice with AI-powered tools.',
          position: 'center',
        },
        {
          id: 'patient-management',
          title: 'Patient Management',
          content: 'Access patient records and clinical decision support.',
          target: '[data-tour="patient-management"]',
          position: 'left',
        },
        {
          id: 'ai-diagnostics',
          title: 'AI Diagnostics',
          content: 'Leverage AI for diagnostic assistance and treatment planning.',
          target: '[data-tour="ai-diagnostics"]',
          position: 'right',
        },
      ],
      flows: {
        'clinical-advanced': {
          id: 'clinical-advanced',
          name: 'Advanced Clinical Tools',
          description: 'Specialized clinical workflow automation',
          steps: [
            {
              id: 'clinical-decision',
              title: 'Clinical Decision Support',
              content: 'Get AI-powered recommendations for patient care.',
              target: '[data-tour="clinical-decision"]',
              position: 'top',
            },
            {
              id: 'treatment-planning',
              title: 'Treatment Planning',
              content: 'Create personalized treatment plans with AI assistance.',
              target: '[data-tour="treatment-planning"]',
              position: 'bottom',
            },
          ],
          unlockCondition: (progress, insights) => progress['patient-management'] === 'completed',
        },
      },
      hotkeys: {
        next: 'Alt + →',
        previous: 'Alt + ←',
        pause: 'Alt + Space',
        skip: 'Alt + S',
        restart: 'Alt + R',
      },
    },
    healthcare_professional: {
      steps: [
        {
          id: 'healthcare-welcome',
          title: 'Healthcare Platform',
          content: 'Access comprehensive healthcare automation tools.',
          position: 'center',
        },
        {
          id: 'workflow-automation',
          title: 'Workflow Automation',
          content: 'Automate routine tasks and streamline processes.',
          target: '[data-tour="workflow-automation"]',
          position: 'left',
        },
        {
          id: 'compliance',
          title: 'Compliance & Security',
          content: 'Ensure HIPAA compliance and data security.',
          target: '[data-tour="compliance"]',
          position: 'right',
        },
      ],
      flows: {
        'healthcare-advanced': {
          id: 'healthcare-advanced',
          name: 'Advanced Healthcare Tools',
          description: 'Specialized healthcare automation features',
          steps: [
            {
              id: 'analytics',
              title: 'Analytics Dashboard',
              content: 'Monitor key metrics and performance indicators.',
              target: '[data-tour="analytics"]',
              position: 'top',
            },
            {
              id: 'reporting',
              title: 'Reporting Tools',
              content: 'Generate comprehensive reports and insights.',
              target: '[data-tour="reporting"]',
              position: 'bottom',
            },
          ],
          unlockCondition: (progress, insights) => progress['workflow-automation'] === 'completed',
        },
      },
      hotkeys: {
        next: 'Alt + →',
        previous: 'Alt + ←',
        pause: 'Alt + Space',
        skip: 'Alt + S',
        restart: 'Alt + R',
      },
    },
    admin: {
      steps: [
        {
          id: 'admin-welcome',
          title: 'Administrative Dashboard',
          content: 'Manage system configuration and user access.',
          position: 'center',
        },
        {
          id: 'user-management',
          title: 'User Management',
          content: 'Manage user accounts, roles, and permissions.',
          target: '[data-tour="user-management"]',
          position: 'left',
        },
        {
          id: 'system-config',
          title: 'System Configuration',
          content: 'Configure system settings and integrations.',
          target: '[data-tour="system-config"]',
          position: 'right',
        },
      ],
      flows: {
        'admin-advanced': {
          id: 'admin-advanced',
          name: 'Advanced Administration',
          description: 'Advanced administrative tools and monitoring',
          steps: [
            {
              id: 'monitoring',
              title: 'System Monitoring',
              content: 'Monitor system performance and health.',
              target: '[data-tour="monitoring"]',
              position: 'top',
            },
            {
              id: 'security',
              title: 'Security Management',
              content: 'Manage security policies and access controls.',
              target: '[data-tour="security"]',
              position: 'bottom',
            },
          ],
          unlockCondition: (progress, insights) => progress['user-management'] === 'completed',
        },
      },
      hotkeys: {
        next: 'Alt + →',
        previous: 'Alt + ←',
        pause: 'Alt + Space',
        skip: 'Alt + S',
        restart: 'Alt + R',
      },
    },
  },
  globalHotkeys: {
    show: 'Alt + T',
    hide: 'Escape',
  },
};