/**
 * Component Factory Utilities
 * Standardizes component creation patterns and reduces code duplication
 */

import { MotionProps } from 'framer-motion';
import { ComponentType, ReactNode } from 'react';

// Animation presets
export const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    },
    slideInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    },
    stagger: {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

// Status indicators - Professional colors for military, health, legal
export const statusIndicators = {
    operational: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    error: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    info: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    processing: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' }
};

// Enterprise card variants - Professional colors for military, health, legal
export const cardVariants = {
    default: 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10',
    glass: 'bg-slate-900/50 backdrop-blur-md border-slate-700/50',
    enterprise: 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50',
    quantum: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30',
    neural: 'bg-gradient-to-br from-blue-900/20 to-teal-900/20 border-blue-500/30',
    success: 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30'
};

// Component interfaces
export interface EnterpriseCardProps {
    variant?: keyof typeof cardVariants;
    icon?: ReactNode;
    title: string;
    description?: string;
    badges?: string[];
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
    animated?: boolean;
}

export interface StatusCardProps {
    status: keyof typeof statusIndicators;
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    trend?: {
        value: number;
        label: string;
    };
    className?: string;
}

export interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    change?: {
        value: number;
        period: string;
    };
    status?: keyof typeof statusIndicators;
    icon?: ReactNode;
    className?: string;
}

// Utility functions for creating standardized components
export function createMotionComponent<T = {}>(
    component: ReactNode,
    animation: keyof typeof animations = 'fadeIn',
    props?: MotionProps & T
) {
    return {
        component,
        animation: animations[animation],
        props
    };
}

export function createStatusBadge(status: keyof typeof statusIndicators, label: string) {
    const style = statusIndicators[status];
    return {
        className: `${style.bg} ${style.color} ${style.border}`,
        label
    };
}

export function createGradientButton(
    text: string,
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary'
) {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
        secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
        success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
        warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
    };

    return {
        className: `${variants[variant]} text-white border-0`,
        text
    };
}

// Enterprise layout utilities
export const layoutUtils = {
    centerContent: 'flex items-center justify-center',
    spaceBetween: 'flex items-center justify-between',
    stackVertical: 'flex flex-col space-y-4',
    gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    gridCards: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6',
    flexWrap: 'flex flex-wrap gap-4',
    glassMorphism: 'backdrop-blur-md bg-white/10 border border-white/20',
    enterpriseContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
};

// CSS class generators
export const cssUtils = {
    combineClasses: (...classes: (string | undefined | null | false)[]): string => {
        return classes.filter(Boolean).join(' ');
    },

    generateStatusClasses: (status: keyof typeof statusIndicators): string => {
        const indicator = statusIndicators[status];
        return `${indicator.bg} ${indicator.color} ${indicator.border}`;
    },

    generateCardClasses: (variant: keyof typeof cardVariants, additional?: string): string => {
        const base = cardVariants[variant];
        return additional ? `${base} ${additional}` : base;
    }
};

export interface ComponentConfig {
    type: string;
    variant?: string;
    theme?: string;
    className?: string;
}

export interface StyleVariants {
    [key: string]: {
        color: string;
        bg: string;
        border: string;
    };
}

export interface ThemeVariants {
    [key: string]: string;
}

export interface ButtonVariants {
    [key: string]: string;
}

// Professional color schemes - NO PURPLE
export const statusVariants: StyleVariants = {
    active: { color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/30' },
    pending: { color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-500/30' },
    completed: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    error: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    warning: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30' },
    info: { color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/30' },
    success: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    processing: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' }
};

// Professional theme variants - NO PURPLE
export const themeVariants: ThemeVariants = {
    default: 'bg-slate-900/50 border-slate-700/50',
    primary: 'bg-blue-900/20 border-blue-500/30',
    secondary: 'bg-slate-800/50 border-slate-600/50',
    quantum: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30',
    neural: 'bg-gradient-to-br from-blue-900/20 to-teal-900/20 border-blue-500/30',
    success: 'bg-green-900/20 border-green-500/30',
    warning: 'bg-amber-900/20 border-amber-500/30',
    danger: 'bg-red-900/20 border-red-500/30'
};

// Professional button variants - NO PURPLE
export const buttonVariants: ButtonVariants = {
    default: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600',
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-500',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    warning: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border-transparent',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border-slate-600'
};

export class ComponentFactory {
    private static themes: Map<string, ThemeVariants> = new Map();

    static registerTheme(name: string, theme: ThemeVariants): void {
        this.themes.set(name, theme);
    }

    static getTheme(name: string): ThemeVariants | undefined {
        return this.themes.get(name);
    }

    static createComponent<T extends ComponentType<any>>(
        Component: T,
        config: ComponentConfig
    ): T {
        // Component factory logic here
        return Component;
    }

    static generateClassName(config: ComponentConfig): string {
        const { type, variant = 'default', theme = 'default' } = config;

        let className = config.className || '';

        // Apply base styles
        if (type === 'card') {
            className += ' rounded-lg border shadow-sm ';
        } else if (type === 'button') {
            className += ' inline-flex items-center justify-center rounded-md text-sm font-medium ';
        }

        // Apply theme
        if (themeVariants[theme]) {
            className += themeVariants[theme] + ' ';
        }

        // Apply variant
        if (type === 'button' && buttonVariants[variant]) {
            className += buttonVariants[variant] + ' ';
        } else if (statusVariants[variant]) {
            const status = statusVariants[variant];
            className += `${status.color} ${status.bg} ${status.border} `;
        }

        return className.trim();
    }
}

// Professional utility functions
export const createProfessionalGradient = (type: 'primary' | 'secondary' | 'accent' = 'primary'): string => {
    switch (type) {
        case 'primary':
            return 'bg-gradient-to-r from-blue-600 to-cyan-600';
        case 'secondary':
            return 'bg-gradient-to-r from-slate-600 to-slate-700';
        case 'accent':
            return 'bg-gradient-to-r from-teal-600 to-blue-600';
        default:
            return 'bg-gradient-to-r from-blue-600 to-cyan-600';
    }
};

export const createProfessionalShadow = (intensity: 'low' | 'medium' | 'high' = 'medium'): string => {
    switch (intensity) {
        case 'low':
            return 'shadow-sm';
        case 'medium':
            return 'shadow-md';
        case 'high':
            return 'shadow-lg';
        default:
            return 'shadow-md';
    }
}; 