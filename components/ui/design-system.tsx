import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Enhanced color palette with professional gradients
export const colorVariants = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
  secondary: "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800",
  success: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
  warning: "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
  danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
  info: "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800",
  ai: "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800",
  healthcare: "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
  defense: "bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800",
};

// Professional button variants
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "text-white shadow-lg hover:shadow-xl",
        ai: "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg hover:from-purple-700 hover:to-indigo-800",
        healthcare: "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg hover:from-teal-700 hover:to-teal-800",
        defense: "bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg hover:from-orange-700 hover:to-red-800",
        glass: "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20",
        neon: "bg-transparent border-2 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced card variants
export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl border-0",
        glass: "backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20",
        gradient: "bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50",
        ai: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30 hover:border-purple-400/50",
        healthcare: "bg-gradient-to-br from-teal-900/20 to-teal-800/20 border-teal-500/30 hover:border-teal-400/50",
        defense: "bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 hover:border-orange-400/50",
        interactive: "cursor-pointer hover:scale-[1.02] hover:shadow-lg",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

// Professional input variants
export const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:border-input/80",
        glass: "backdrop-blur-md bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40",
        ai: "border-purple-500/30 focus:border-purple-400 bg-purple-950/20",
        healthcare: "border-teal-500/30 focus:border-teal-400 bg-teal-950/20",
        defense: "border-orange-500/30 focus:border-orange-400 bg-orange-950/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Badge variants for status indicators
export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        ai: "border-purple-500/30 bg-purple-950/20 text-purple-300",
        healthcare: "border-teal-500/30 bg-teal-950/20 text-teal-300",
        defense: "border-orange-500/30 bg-orange-950/20 text-orange-300",
        success: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300",
        warning: "border-amber-500/30 bg-amber-950/20 text-amber-300",
        info: "border-cyan-500/30 bg-cyan-950/20 text-cyan-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Navigation variants
export const navVariants = cva(
  "flex items-center space-x-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground",
        glass: "backdrop-blur-md bg-white/5 rounded-lg px-3 py-2 hover:bg-white/10",
        gradient: "bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg px-3 py-2 hover:from-slate-700/50 hover:to-slate-600/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Animation utilities
export const animationVariants = {
  fadeIn: "animate-in fade-in duration-300",
  slideIn: "animate-in slide-in-from-bottom-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  slideInFromLeft: "animate-in slide-in-from-left-4 duration-300",
  slideInFromRight: "animate-in slide-in-from-right-4 duration-300",
  slideInFromTop: "animate-in slide-in-from-top-4 duration-300",
  slideInFromBottom: "animate-in slide-in-from-bottom-4 duration-300",
};

// Professional spacing scale
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
};

// Typography scale
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
};

// Professional shadows
export const shadows = {
  sm: "shadow-sm",
  default: "shadow",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
  none: "shadow-none",
  glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  glowPurple: "shadow-[0_0_20px_rgba(147,51,234,0.3)]",
  glowTeal: "shadow-[0_0_20px_rgba(20,184,166,0.3)]",
  glowOrange: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
};

// Utility function for combining variants
export function combineVariants(...variants: string[]) {
  return cn(...variants);
}

// Professional gradient backgrounds
export const gradients = {
  primary: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
  secondary: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
  ai: "bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800",
  healthcare: "bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800",
  defense: "bg-gradient-to-br from-orange-600 via-red-700 to-orange-800",
  success: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800",
  warning: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800",
  danger: "bg-gradient-to-br from-red-600 via-red-700 to-red-800",
  glass: "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
  dark: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
};

// Professional border styles
export const borders = {
  default: "border border-border",
  primary: "border border-primary/20",
  ai: "border border-purple-500/30",
  healthcare: "border border-teal-500/30",
  defense: "border border-orange-500/30",
  glass: "border border-white/20",
  glow: "border border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
  glowPurple: "border border-purple-400/50 shadow-[0_0_10px_rgba(147,51,234,0.3)]",
  glowTeal: "border border-teal-400/50 shadow-[0_0_10px_rgba(20,184,166,0.3)]",
  glowOrange: "border border-orange-400/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]",
};

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type NavVariants = VariantProps<typeof navVariants>;