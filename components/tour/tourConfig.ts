export type Role = "guest" | "developer" | "admin" | "clinician" | "researcher" | "executive";

export interface TourStep {
  id: string;
  role: Role;
  title: string;
  content: string;
  anchor?: string;
  selector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'none';
  required?: boolean;
  skipIf?: string; // Condition to skip this step
  autoAdvance?: boolean; // Auto-advance after action
  delay?: number; // Delay before showing step
  hotkeys?: string[]; // Custom hotkeys for this step
}

export interface TourFlow {
  id: string;
  name: string;
  description: string;
  roles: Role[];
  steps: string[]; // Step IDs
  autoStart?: boolean;
  priority?: number;
}

// Core tour steps for different roles
export const TOUR_STEPS: TourStep[] = [
  // Guest/General Steps
  {
    id: "welcome-aiden",
    role: "guest",
    title: "Welcome to AIDEN",
    content: "Welcome to the Advanced Intelligence & Data Engineering Network. This platform combines AI, healthcare, and advanced analytics.",
    position: "center",
    action: "none",
    autoAdvance: true,
    delay: 1000
  },
  {
    id: "navigation-overview",
    role: "guest",
    title: "Navigation Overview",
    content: "Use the top navigation to explore different sections. Each tab provides specialized tools and insights.",
    selector: "nav",
    position: "bottom",
    action: "hover"
  },
  {
    id: "ai-assistant-intro",
    role: "guest",
    title: "AI Assistant",
    content: "The AI assistant (🤖) provides contextual help and guidance throughout your journey.",
    selector: "[data-tour='ai-assistant']",
    position: "left",
    action: "click"
  },

  // Developer Steps
  {
    id: "dev-welcome",
    role: "developer",
    title: "Developer Dashboard",
    content: "Welcome to the developer workspace. Here you can access APIs, test endpoints, and monitor system performance.",
    position: "center",
    action: "none"
  },
  {
    id: "api-documentation",
    role: "developer",
    title: "API Documentation",
    content: "Access comprehensive API documentation with live testing capabilities and code examples.",
    selector: "[data-tour='api-docs']",
    position: "right",
    action: "click"
  },
  {
    id: "live-reload-api",
    role: "developer",
    title: "Live Reload API",
    content: "Test hot module reload across agents. Changes are reflected in real-time across all connected systems.",
    selector: "[data-tour='live-reload']",
    position: "bottom",
    action: "click",
    hotkeys: ["ctrl+r", "cmd+r"]
  },
  {
    id: "debug-console",
    role: "developer",
    title: "Debug Console",
    content: "Monitor system logs, errors, and performance metrics in real-time.",
    selector: "[data-tour='debug-console']",
    position: "bottom",
    action: "click"
  },

  // Admin Steps
  {
    id: "admin-dashboard",
    role: "admin",
    title: "Administrative Dashboard",
    content: "Manage users, system settings, and monitor platform health from this centralized dashboard.",
    position: "center",
    action: "none"
  },
  {
    id: "user-management",
    role: "admin",
    title: "User Management",
    content: "Manage access levels, roles, and activity logs for all platform users.",
    selector: "[data-tour='user-management']",
    position: "right",
    action: "click"
  },
  {
    id: "system-monitoring",
    role: "admin",
    title: "System Monitoring",
    content: "Monitor system performance, resource usage, and security metrics.",
    selector: "[data-tour='system-monitoring']",
    position: "bottom",
    action: "click"
  },
  {
    id: "security-audit",
    role: "admin",
    title: "Security Audit",
    content: "Review security logs, access patterns, and compliance reports.",
    selector: "[data-tour='security-audit']",
    position: "left",
    action: "click"
  },

  // Clinician Steps
  {
    id: "clinician-welcome",
    role: "clinician",
    title: "Clinical Dashboard",
    content: "Welcome to your clinical workspace. Access patient data, AI insights, and treatment recommendations.",
    position: "center",
    action: "none"
  },
  {
    id: "patient-overview",
    role: "clinician",
    title: "Patient Overview",
    content: "View comprehensive patient information, medical history, and current status.",
    selector: "[data-tour='patient-overview']",
    position: "right",
    action: "click"
  },
  {
    id: "genomic-summary",
    role: "clinician",
    title: "Genomic Summary View",
    content: "AIDEN shows real-time tumor markers and risk factors here. AI-powered insights help guide treatment decisions.",
    selector: "[data-tour='genomic-summary']",
    position: "bottom",
    action: "click",
    required: true
  },
  {
    id: "treatment-recommendations",
    role: "clinician",
    title: "Treatment Recommendations",
    content: "AI-generated treatment recommendations based on patient data and latest medical research.",
    selector: "[data-tour='treatment-recommendations']",
    position: "left",
    action: "click"
  },

  // Researcher Steps
  {
    id: "researcher-welcome",
    role: "researcher",
    title: "Research Workspace",
    content: "Access advanced analytics, research tools, and collaborative features for your studies.",
    position: "center",
    action: "none"
  },
  {
    id: "data-analytics",
    role: "researcher",
    title: "Data Analytics",
    content: "Advanced analytics tools for research data analysis and visualization.",
    selector: "[data-tour='data-analytics']",
    position: "right",
    action: "click"
  },
  {
    id: "collaboration-tools",
    role: "researcher",
    title: "Collaboration Tools",
    content: "Share research findings, collaborate with team members, and manage research projects.",
    selector: "[data-tour='collaboration-tools']",
    position: "bottom",
    action: "click"
  },

  // Executive Steps
  {
    id: "executive-dashboard",
    role: "executive",
    title: "Executive Dashboard",
    content: "High-level overview of platform performance, user engagement, and strategic insights.",
    position: "center",
    action: "none"
  },
  {
    id: "performance-metrics",
    role: "executive",
    title: "Performance Metrics",
    content: "Key performance indicators and business metrics for strategic decision-making.",
    selector: "[data-tour='performance-metrics']",
    position: "right",
    action: "click"
  },
  {
    id: "user-engagement",
    role: "executive",
    title: "User Engagement",
    content: "Monitor user engagement, adoption rates, and platform utilization.",
    selector: "[data-tour='user-engagement']",
    position: "bottom",
    action: "click"
  }
];

// Tour flows for different scenarios
export const TOUR_FLOWS: TourFlow[] = [
  {
    id: "first-time-user",
    name: "First Time User",
    description: "Complete onboarding for new users",
    roles: ["guest"],
    steps: ["welcome-aiden", "navigation-overview", "ai-assistant-intro"],
    autoStart: true,
    priority: 1
  },
  {
    id: "developer-onboarding",
    name: "Developer Onboarding",
    description: "Developer-specific features and tools",
    roles: ["developer"],
    steps: ["dev-welcome", "api-documentation", "live-reload-api", "debug-console"],
    autoStart: true,
    priority: 2
  },
  {
    id: "admin-setup",
    name: "Administrator Setup",
    description: "Administrative tools and user management",
    roles: ["admin"],
    steps: ["admin-dashboard", "user-management", "system-monitoring", "security-audit"],
    autoStart: true,
    priority: 3
  },
  {
    id: "clinician-training",
    name: "Clinical Training",
    description: "Clinical tools and patient management",
    roles: ["clinician"],
    steps: ["clinician-welcome", "patient-overview", "genomic-summary", "treatment-recommendations"],
    autoStart: true,
    priority: 4
  },
  {
    id: "researcher-tools",
    name: "Research Tools",
    description: "Research and analytics capabilities",
    roles: ["researcher"],
    steps: ["researcher-welcome", "data-analytics", "collaboration-tools"],
    autoStart: false,
    priority: 5
  },
  {
    id: "executive-overview",
    name: "Executive Overview",
    description: "High-level business insights and metrics",
    roles: ["executive"],
    steps: ["executive-dashboard", "performance-metrics", "user-engagement"],
    autoStart: false,
    priority: 6
  }
];

// Helper functions
export const getStepsForRole = (role: Role): TourStep[] => {
  return TOUR_STEPS.filter(step => step.role === role);
};

export const getFlowForRole = (role: Role): TourFlow | undefined => {
  return TOUR_FLOWS.find(flow => flow.roles.includes(role));
};

export const getStepById = (id: string): TourStep | undefined => {
  return TOUR_STEPS.find(step => step.id === id);
};

export const getStepsForFlow = (flowId: string): TourStep[] => {
  const flow = TOUR_FLOWS.find(f => f.id === flowId);
  if (!flow) return [];

  return flow.steps
    .map(stepId => getStepById(stepId))
    .filter((step): step is TourStep => step !== undefined);
};