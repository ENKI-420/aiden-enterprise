"use client";

import { animationVariants, badgeVariants, navVariants } from '@/components/ui/design-system';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { cn } from '@/lib/utils';
import {
  AcademicCapIcon,
  Bars3Icon,
  BeakerIcon,
  BellIcon,
  ChartBarIcon,
  CogIcon,
  CommandLineIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoCameraIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  roles?: string[];
  ai?: boolean;
  healthcare?: boolean;
  defense?: boolean;
  featured?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Main application dashboard',
    roles: ['guest', 'developer', 'admin', 'clinician', 'researcher', 'executive'],
  },
  {
    name: 'AI Coding Suite',
    href: '/ai-coding-suite',
    icon: CommandLineIcon,
    description: 'Advanced AI-powered development environment',
    badge: 'AI',
    ai: true,
    featured: true,
    roles: ['developer', 'admin'],
  },
  {
    name: 'Project Spectra',
    href: '/project-spectra',
    icon: BeakerIcon,
    description: 'Pyramid research and physics simulation',
    badge: 'Research',
    featured: true,
    roles: ['researcher', 'admin', 'executive'],
  },
  {
    name: 'Healthcare Platform',
    href: '/healthcare-platform',
    icon: HeartIcon,
    description: 'Clinical workflow automation',
    badge: 'Healthcare',
    healthcare: true,
    featured: true,
    roles: ['clinician', 'admin', 'researcher'],
  },
  {
    name: 'Defense Systems',
    href: '/defense-systems',
    icon: ShieldCheckIcon,
    description: 'Cybersecurity and defense solutions',
    badge: 'Defense',
    defense: true,
    featured: true,
    roles: ['admin', 'executive'],
  },
  {
    name: 'Conference',
    href: '/conference',
    icon: VideoCameraIcon,
    description: 'Virtual conference and collaboration',
    roles: ['guest', 'admin', 'clinician', 'researcher', 'executive'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Data analytics and insights',
    roles: ['admin', 'researcher', 'executive'],
  },
  {
    name: 'Experiments',
    href: '/experiments',
    icon: AcademicCapIcon,
    description: 'Research experiments and trials',
    roles: ['researcher', 'admin'],
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: CogIcon,
    description: 'System administration',
    roles: ['admin'],
  },
  {
    name: 'Tour Demo',
    href: '/tour-demo',
    icon: SparklesIcon,
    description: 'Interactive onboarding demo',
    roles: ['guest', 'developer', 'admin'],
  },
];

interface AppNavigationProps {
  userRole?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  showSearch?: boolean;
  showNotifications?: boolean;
  compact?: boolean;
}

export default function AppNavigation({
  userRole = 'guest',
  className,
  variant = 'default',
  showSearch = true,
  showNotifications = true,
  compact = false,
}: AppNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item =>
    !item.roles || item.roles.includes(userRole)
  );

  // Search functionality
  const searchResults = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedItems = searchQuery ? searchResults : filteredItems;

  const NavItem = ({ item, isActive }: { item: NavigationItem; isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        navVariants({ variant }),
        "group relative flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        {
          "bg-primary/10 text-primary border-primary/20": isActive,
          "text-muted-foreground hover:text-foreground hover:bg-accent": !isActive,
        }
      )}
    >
      <item.icon className={cn(
        "h-5 w-5 flex-shrink-0 transition-colors",
        {
          "text-primary": isActive,
          "text-muted-foreground group-hover:text-foreground": !isActive,
        }
      )} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className={cn(
              badgeVariants({
                variant: item.ai ? 'ai' :
                         item.healthcare ? 'healthcare' :
                         item.defense ? 'defense' : 'default'
              }),
              "text-xs"
            )}>
              {item.badge}
            </span>
          )}
          {item.featured && (
            <SparklesIcon className="h-3 w-3 text-yellow-400" />
          )}
        </div>
        {!compact && item.description && (
          <p className="text-xs text-muted-foreground truncate">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );

  return (
    <nav className={cn(
      "relative z-50",
      className
    )}>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between space-x-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <RocketLaunchIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AIDEN
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {showNotifications && (
              <EnhancedButton
                variant="ghost"
                size="icon"
                className="relative"
                ai
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </EnhancedButton>
            )}

            <EnhancedButton
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <Bars3Icon className="h-5 w-5" />
            </EnhancedButton>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <RocketLaunchIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AIDEN
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {showNotifications && (
              <EnhancedButton
                variant="ghost"
                size="icon"
                className="relative"
                ai
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </EnhancedButton>
            )}

            <EnhancedButton
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </EnhancedButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={cn(
            "mt-4 space-y-2",
            animationVariants.slideInFromTop
          )}>
            {showSearch && (
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
            )}

            {displayedItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}