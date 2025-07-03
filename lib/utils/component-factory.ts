/**
 * Component Factory Utilities
 * Standardizes component creation patterns and reduces code duplication
 */

import { MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

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

// Status indicators
export const statusIndicators = {
    operational: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    error: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/30' },
    info: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/30' },
    processing: { color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' }
};

// Enterprise card variants
export const cardVariants = {
    default: 'bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10',
    glass: 'bg-slate-900/50 backdrop-blur-md border-slate-700/50',
    enterprise: 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50',
    quantum: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30',
    neural: 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30',
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
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
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