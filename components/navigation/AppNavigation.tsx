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
  ChevronDownIcon,
  ChevronRightIcon,
  CogIcon,
  CommandLineIcon,
  DocumentIcon,
  FolderIcon,
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
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  children?: NavigationItem[];
  isExpanded?: boolean;
  level?: number;
  category?: string;
  tags?: string[];
  priority?: number;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Main application dashboard',
    roles: ['guest', 'developer', 'admin', 'clinician', 'researcher', 'executive'],
    priority: 1,
    tags: ['main', 'overview'],
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
    priority: 1,
    tags: ['ai', 'development', 'coding'],
    children: [
      {
        name: 'Code Editor',
        href: '/ai-coding-suite/editor',
        icon: DocumentIcon,
        description: 'Intelligent code editor with AI assistance',
        level: 1,
        tags: ['editor', 'coding'],
      },
      {
        name: 'AI Assistant',
        href: '/ai-coding-suite/assistant',
        icon: SparklesIcon,
        description: 'AI-powered coding assistant',
        level: 1,
        tags: ['ai', 'assistant'],
      },
      {
        name: 'Project Templates',
        href: '/ai-coding-suite/templates',
        icon: FolderIcon,
        description: 'Pre-built project templates',
        level: 1,
        tags: ['templates', 'projects'],
      }
    ]
  },
  {
    name: 'Project Spectra',
    href: '/project-spectra',
    icon: BeakerIcon,
    description: 'Pyramid research and physics simulation',
    badge: 'Research',
    featured: true,
    roles: ['researcher', 'admin', 'executive'],
    priority: 1,
    tags: ['research', 'physics', 'simulation'],
    children: [
      {
        name: 'Simulation Engine',
        href: '/project-spectra/simulation',
        icon: BeakerIcon,
        description: 'Advanced physics simulation engine',
        level: 1,
        tags: ['simulation', 'physics'],
      },
      {
        name: 'Data Analysis',
        href: '/project-spectra/analysis',
        icon: ChartBarIcon,
        description: 'Research data analysis tools',
        level: 1,
        tags: ['analysis', 'data'],
      }
    ]
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
    priority: 1,
    tags: ['healthcare', 'clinical'],
    children: [
      {
        name: 'Patient Records',
        href: '/healthcare-platform/records',
        icon: DocumentIcon,
        description: 'Electronic health records management',
        level: 1,
        tags: ['records', 'patients'],
      },
      {
        name: 'Clinical Trials',
        href: '/healthcare-platform/trials',
        icon: AcademicCapIcon,
        description: 'Clinical trial management system',
        level: 1,
        tags: ['trials', 'clinical'],
      }
    ]
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
    priority: 1,
    tags: ['defense', 'security'],
    children: [
      {
        name: 'Threat Detection',
        href: '/defense-systems/threats',
        icon: ShieldCheckIcon,
        description: 'Advanced threat detection system',
        level: 1,
        tags: ['threats', 'detection'],
      },
      {
        name: 'Security Analytics',
        href: '/defense-systems/analytics',
        icon: ChartBarIcon,
        description: 'Security analytics dashboard',
        level: 1,
        tags: ['analytics', 'security'],
      }
    ]
  },
  {
    name: 'Conference',
    href: '/conference',
    icon: VideoCameraIcon,
    description: 'Virtual conference and collaboration',
    roles: ['guest', 'admin', 'clinician', 'researcher', 'executive'],
    priority: 2,
    tags: ['conference', 'collaboration'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Data analytics and insights',
    roles: ['admin', 'researcher', 'executive'],
    priority: 2,
    tags: ['analytics', 'data'],
  },
  {
    name: 'Experiments',
    href: '/experiments',
    icon: AcademicCapIcon,
    description: 'Research experiments and trials',
    roles: ['researcher', 'admin'],
    priority: 2,
    tags: ['experiments', 'research'],
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: CogIcon,
    description: 'System administration',
    roles: ['admin'],
    priority: 3,
    tags: ['admin', 'system'],
  },
  {
    name: 'Tour Demo',
    href: '/tour-demo',
    icon: SparklesIcon,
    description: 'Interactive onboarding demo',
    roles: ['guest', 'developer', 'admin'],
    priority: 3,
    tags: ['demo', 'onboarding'],
  },
];

interface AppNavigationProps {
  userRole?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  showSearch?: boolean;
  showNotifications?: boolean;
  compact?: boolean;
  enableRecursive?: boolean;
  maxDepth?: number;
  showCategories?: boolean;
}

// Fuzzy search function
const fuzzySearch = (query: string, text: string): boolean => {
  const pattern = query.split('').join('.*');
  const regex = new RegExp(pattern, 'i');
  return regex.test(text);
};

// Recursive function to flatten navigation items
const flattenNavigationItems = (items: NavigationItem[], level = 0): NavigationItem[] => {
  let flattened: NavigationItem[] = [];

  items.forEach(item => {
    const itemWithLevel = { ...item, level };
    flattened.push(itemWithLevel);

    if (item.children && item.children.length > 0) {
      flattened = flattened.concat(flattenNavigationItems(item.children, level + 1));
    }
  });

  return flattened;
};

// Recursive function to render navigation items
const renderNavigationItems = (
  items: NavigationItem[],
  pathname: string,
  level = 0,
  maxDepth = 3,
  onToggleExpand?: (item: NavigationItem) => void
): React.ReactNode => {
  return items.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.isExpanded ?? false;
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

    return (
      <div key={item.href} className="space-y-1">
        <Link
          href={item.href}
          className={cn(
            navVariants({ variant: 'default' }),
            "group relative flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            {
              "bg-primary/10 text-primary border-primary/20": isActive,
              "text-muted-foreground hover:text-foreground hover:bg-accent": !isActive,
            },
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${(level * 16) + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleExpand?.(item);
              }}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-3 w-3" />
              ) : (
                <ChevronRightIcon className="h-3 w-3" />
              )}
            </button>
          )}

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
            {item.description && (
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            )}
          </div>
        </Link>

        {hasChildren && isExpanded && level < maxDepth && (
          <div className="space-y-1">
            {renderNavigationItems(item.children!, pathname, level + 1, maxDepth, onToggleExpand)}
          </div>
        )}
      </div>
    );
  });
};

export default function AppNavigation({
  userRole = 'guest',
  className,
  variant = 'default',
  showSearch = true,
  showNotifications = true,
  compact = false,
  enableRecursive = true,
  maxDepth = 3,
  showCategories = true,
}: AppNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item =>
    !item.roles || item.roles.includes(userRole)
  );

  // Enhanced search functionality with fuzzy matching
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const flattenedItems = flattenNavigationItems(filteredItems);
    return flattenedItems.filter(item => {
      const searchText = `${item.name} ${item.description || ''} ${item.tags?.join(' ') || ''}`.toLowerCase();
      return fuzzySearch(searchQuery.toLowerCase(), searchText);
    }).slice(0, 10); // Limit results
  }, [searchQuery, filteredItems]);

  const displayedItems = searchQuery ? [] : filteredItems;

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!searchQuery || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          window.location.href = searchResults[selectedIndex].href;
        }
        break;
      case 'Escape':
        setSearchQuery('');
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  }, [searchQuery, searchResults, selectedIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle expanded state for recursive navigation
  const handleToggleExpand = useCallback((item: NavigationItem) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.href)) {
        newSet.delete(item.href);
      } else {
        newSet.add(item.href);
      }
      return newSet;
    });
  }, []);

  // Apply expanded state to items
  const itemsWithExpandedState = React.useMemo(() => {
    const applyExpandedState = (items: NavigationItem[]): NavigationItem[] => {
      return items.map(item => ({
        ...item,
        isExpanded: expandedItems.has(item.href),
        children: item.children ? applyExpandedState(item.children) : undefined
      }));
    };
    return applyExpandedState(filteredItems);
  }, [filteredItems, expandedItems]);

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

          {/* Enhanced Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search features, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => setSelectedIndex(-1)}
                  className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                  aria-label="Search navigation items"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && searchResults.length > 0 && (
                <div
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.map((item, index) => (
                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 hover:bg-accent transition-colors",
                        {
                          "bg-accent": index === selectedIndex
                        }
                      )}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedIndex(-1);
                      }}
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.name}</span>
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
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
          {enableRecursive ? (
            <div className="space-y-2">
              {renderNavigationItems(itemsWithExpandedState, pathname, 0, maxDepth, handleToggleExpand)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

            {enableRecursive ? (
              <div className="space-y-2">
                {renderNavigationItems(itemsWithExpandedState, pathname, 0, maxDepth, handleToggleExpand)}
              </div>
            ) : (
              displayedItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
}