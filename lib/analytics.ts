// Analytics utility for tracking events and performance
export const analytics = {
  // Track page views
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  },

  // Track custom events
  event: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track user interactions
  trackClick: (elementName: string, location: string) => {
    analytics.event('click', 'user_interaction', `${elementName}_${location}`);
  },

  // Track form submissions
  trackFormSubmission: (formName: string, success: boolean) => {
    analytics.event('form_submit', 'engagement', formName, success ? 1 : 0);
  },

  // Track performance metrics
  trackPerformance: (metric: string, value: number) => {
    analytics.event('performance', 'web_vitals', metric, Math.round(value));
  },
};

// Performance monitoring
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    analytics.trackPerformance(metric.name, metric.value);
  }
};

// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}