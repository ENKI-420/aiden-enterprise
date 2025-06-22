"use client";

import AIEnhancedHeader from '@/components/ai/AIEnhancedHeader';
import AppNavigation from '@/components/navigation/AppNavigation';
import { TourGuideProvider } from '@/components/tour';
import { animationVariants } from '@/components/ui/design-system';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface AIEnhancedLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  showNavigation?: boolean;
  showHeader?: boolean;
  showTour?: boolean;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AIEnhancedLayout({
  children,
  userRole = 'guest',
  showNavigation = true,
  showHeader = true,
  showTour = true,
  className,
  variant = 'default',
  sidebar,
  footer,
}: AIEnhancedLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'processing' | 'ready'>('ready');

  // Simulate AI status changes based on page navigation
  useEffect(() => {
    setIsLoading(true);
    setAiStatus('processing');

    const timer = setTimeout(() => {
      setIsLoading(false);
      setAiStatus('ready');
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const LayoutWrapper = ({ children: layoutChildren }: { children: React.ReactNode }) => {
    if (showTour) {
      return (
        <TourGuideProvider
          defaultRole={userRole as any}
          autoStart={true}
          persistProgress={true}
          enableHotkeys={true}
          enableSelfHealing={true}
        >
          {layoutChildren}
        </TourGuideProvider>
      );
    }
    return <>{layoutChildren}</>;
  };

  const AIStatusIndicator = () => (
    <div className="fixed bottom-4 right-4 z-50">
      <EnhancedCard
        variant="glass"
        padding="sm"
        className={cn(
          "flex items-center space-x-2 px-3 py-2",
          {
            "border-green-500/30": aiStatus === 'ready',
            "border-yellow-500/30": aiStatus === 'processing',
            "border-gray-500/30": aiStatus === 'idle',
          }
        )}
      >
        <div className={cn(
          "w-2 h-2 rounded-full",
          {
            "bg-green-400 animate-pulse": aiStatus === 'ready',
            "bg-yellow-400 animate-pulse": aiStatus === 'processing',
            "bg-gray-400": aiStatus === 'idle',
          }
        )} />
        <span className="text-xs font-medium">
          AI {aiStatus === 'ready' ? 'Ready' : aiStatus === 'processing' ? 'Processing' : 'Idle'}
        </span>
      </EnhancedCard>
    </div>
  );

  const LoadingOverlay = () => (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      animationVariants.fadeIn
    )}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">AI is analyzing your context...</p>
      </div>
    </div>
  );

  return (
    <LayoutWrapper>
      <div className={cn(
        "min-h-screen bg-background text-foreground",
        {
          "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950": variant === 'gradient',
        },
        className
      )}>
        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay />}

        {/* Navigation */}
        {showNavigation && (
          <div className="border-b border-border/40">
            <div className="container mx-auto px-4 py-4">
              <AppNavigation
                userRole={userRole}
                variant={variant}
                showSearch={true}
                showNotifications={true}
                compact={false}
              />
            </div>
          </div>
        )}

        {/* Header */}
        {showHeader && (
          <AIEnhancedHeader
            userRole={userRole}
            showThemeToggle={true}
            showNotifications={true}
            showUserMenu={true}
            variant={variant}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-6">
              {/* Sidebar */}
              {sidebar && (
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-24">
                    {sidebar}
                  </div>
                </aside>
              )}

              {/* Main Content Area */}
              <div className={cn(
                "flex-1",
                {
                  "lg:ml-0": !sidebar,
                }
              )}>
                <div className={cn(
                  "space-y-6",
                  animationVariants.slideInFromBottom
                )}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        {footer && (
          <footer className="border-t border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 py-6">
              {footer}
            </div>
          </footer>
        )}

        {/* AI Status Indicator */}
        <AIStatusIndicator />
      </div>
    </LayoutWrapper>
  );
}

// Enhanced Page Layout Component
interface EnhancedPageLayoutProps extends AIEnhancedLayoutProps {
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

export function EnhancedPageLayout({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  sidebar,
  footer,
  ...layoutProps
}: EnhancedPageLayoutProps) {
  return (
    <AIEnhancedLayout
      {...layoutProps}
      sidebar={sidebar}
      footer={footer}
    >
      {/* Page Header */}
      {(title || description || breadcrumbs || actions) && (
        <div className="mb-8">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Title and Description */}
          {(title || description) && (
            <div className="flex items-start justify-between mb-6">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      {children}
    </AIEnhancedLayout>
  );
}