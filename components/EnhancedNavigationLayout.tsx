"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Bars3Icon,
    BeakerIcon,
    BellIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    CogIcon,
    CommandLineIcon,
    HeartIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface NavigationItem {
    id: string;
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    children?: NavigationItem[];
    isNew?: boolean;
    isPro?: boolean;
}

const navigationData: NavigationItem[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        description: 'Overview and analytics'
    },
    {
        id: 'ai-coding',
        name: 'AI Coding Suite',
        href: '/ai-coding-suite',
        icon: CommandLineIcon,
        description: 'Advanced AI development tools',
        badge: 'AI',
        badgeVariant: 'secondary',
        isPro: true,
        children: [
            {
                id: 'ai-playground',
                name: 'AI Playground',
                href: '/ai-coding-suite/playground',
                icon: SparklesIcon,
                description: 'Experiment with AI models'
            },
            {
                id: 'code-assistant',
                name: 'Code Assistant',
                href: '/ai-coding-suite/assistant',
                icon: CommandLineIcon,
                description: 'AI-powered coding help'
            }
        ]
    },
    {
        id: 'project-spectra',
        name: 'Project Spectra',
        href: '/project-spectra',
        icon: BeakerIcon,
        description: 'Quantum research platform',
        badge: 'Research',
        badgeVariant: 'default',
        children: [
            {
                id: 'spectra-explore',
                name: 'Explore',
                href: '/project-spectra/explore',
                icon: BeakerIcon,
                description: 'Explore quantum models'
            }
        ]
    },
    {
        id: 'healthcare',
        name: 'Healthcare Platform',
        href: '/healthcare-platform',
        icon: HeartIcon,
        description: 'Clinical workflow automation',
        badge: 'Healthcare',
        badgeVariant: 'outline',
        isPro: true
    },
    {
        id: 'defense',
        name: 'Defense Systems',
        href: '/defense-systems',
        icon: ShieldCheckIcon,
        description: 'Cybersecurity & defense',
        badge: 'Defense',
        badgeVariant: 'destructive',
        isPro: true
    },
    {
        id: 'analytics',
        name: 'Analytics',
        href: '/analytics',
        icon: ChartBarIcon,
        description: 'Data insights & metrics'
    }
];

interface EnhancedNavigationLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function EnhancedNavigationLayout({
    children,
    className
}: EnhancedNavigationLayoutProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const searchRef = useRef<HTMLInputElement>(null);

    // Auto-close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
                setIsSearchFocused(true);
            }
            if (e.key === 'Escape') {
                setIsSearchFocused(false);
                setSearchQuery('');
                searchRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredNavigation = navigationData.filter(item =>
        searchQuery
            ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
            : true
    );

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const renderNavItem = (item: NavigationItem, level = 0) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const isExpanded = expandedItems.has(item.id);
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id} className="space-y-1">
                <div className="relative group">
                    <Link
                        href={item.href}
                        className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            "hover:bg-white/10 hover:backdrop-blur-sm",
                            level > 0 && "ml-6",
                            isActive && "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30",
                            !isActive && "text-gray-300 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 flex-shrink-0",
                            isActive ? "text-cyan-300" : "text-gray-400 group-hover:text-gray-300"
                        )} />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <span className="truncate">{item.name}</span>
                                {item.badge && (
                                    <Badge
                                        variant={item.badgeVariant || 'default'}
                                        className="text-xs px-2 py-0.5"
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                                {item.isPro && (
                                    <SparklesIcon className="w-3 h-3 text-yellow-400" />
                                )}
                                {item.isNew && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </div>
                            {item.description && (
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        {hasChildren && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleExpanded(item.id);
                                }}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                    <ChevronRightIcon className="w-4 h-4" />
                                )}
                            </button>
                        )}
                    </Link>

                    {/* Active indicator */}
                    {isActive && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r"
                            initial={false}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        />
                    )}
                </div>

                {/* Children */}
                <AnimatePresence>
                    {hasChildren && isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-1 overflow-hidden"
                        >
                            {item.children!.map(child => renderNavItem(child, level + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className={cn("min-h-screen bg-slate-950", className)}>
            {/* Mobile backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isSidebarOpen ? 0 : '-100%'
                }}
                className={cn(
                    "fixed top-0 left-0 z-50 w-80 h-full",
                    "bg-gradient-to-b from-slate-900/95 to-slate-950/95",
                    "backdrop-blur-xl border-r border-white/10",
                    "lg:translate-x-0 lg:static lg:z-auto"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                    <SparklesIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-white">IRIS-AI</h1>
                                    <p className="text-xs text-gray-400">Enterprise Platform</p>
                                </div>
                            </Link>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                ref={searchRef}
                                type="text"
                                placeholder="Search... (⌘K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={cn(
                                    "pl-10 pr-4 py-2 w-full",
                                    "bg-white/5 border-white/10 text-white placeholder-gray-400",
                                    "focus:bg-white/10 focus:border-cyan-500/50",
                                    "transition-all duration-200"
                                )}
                            />
                            {isSearchFocused && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <kbd className="px-2 py-1 text-xs text-gray-400 bg-white/10 rounded">
                                        ESC
                                    </kbd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {filteredNavigation.map(item => renderNavItem(item))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-3">
                            <UserCircleIcon className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    Admin User
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    admin@iris-ai.com
                                </p>
                            </div>
                            <Button variant="ghost" size="sm">
                                <CogIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main content */}
            <div className="lg:ml-80 min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between h-full px-6">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Bars3Icon className="w-5 h-5" />
                            </Button>

                            {/* Breadcrumb could go here */}
                            <div className="hidden md:block">
                                <p className="text-sm text-gray-400">
                                    {pathname.split('/').filter(Boolean).join(' / ') || 'Dashboard'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" size="sm" className="relative">
                                <BellIcon className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">3</span>
                                </div>
                            </Button>

                            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                Upgrade
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="relative">
                    {children}
                </main>
            </div>
        </div>
    );
} 