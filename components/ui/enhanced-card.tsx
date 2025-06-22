import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cardVariants } from "./design-system";

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  interactive?: boolean;
  hover?: boolean;
  ai?: boolean;
  healthcare?: boolean;
  defense?: boolean;
  glass?: boolean;
  gradient?: boolean;
  pulse?: boolean;
  glow?: boolean;
  loading?: boolean;
  skeleton?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant,
      padding,
      asChild = false,
      interactive = false,
      hover = true,
      ai = false,
      healthcare = false,
      defense = false,
      glass = false,
      gradient = false,
      pulse = false,
      glow = false,
      loading = false,
      skeleton = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "div" : "div";

    // Determine variant based on props
    let finalVariant = variant;
    if (ai) finalVariant = "ai";
    if (healthcare) finalVariant = "healthcare";
    if (defense) finalVariant = "defense";
    if (glass) finalVariant = "glass";
    if (gradient) finalVariant = "gradient";
    if (interactive) finalVariant = "interactive";

    const cardClasses = cn(
      cardVariants({ variant: finalVariant, padding, className }),
      {
        "animate-pulse": pulse || loading,
        "shadow-[0_0_20px_rgba(59,130,246,0.3)]": glow,
        "shadow-[0_0_20px_rgba(147,51,234,0.3)]": ai && glow,
        "shadow-[0_0_20px_rgba(20,184,166,0.3)]": healthcare && glow,
        "shadow-[0_0_20px_rgba(249,115,22,0.3)]": defense && glow,
        "cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg": interactive && hover,
        "pointer-events-none": loading,
      }
    );

    const SkeletonLoader = () => (
      <div className="space-y-3">
        <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-4/6 animate-pulse"></div>
      </div>
    );

    const renderContent = () => {
      if (loading || skeleton) {
        return <SkeletonLoader />;
      }
      return children;
    };

    return (
      <Comp
        className={cardClasses}
        ref={ref}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, badge, subtitle, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {children}
          </h3>
        </div>
        {badge && <span>{badge}</span>}
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Card Footer Component
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-6", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { CardContent, CardFooter, CardHeader, EnhancedCard };
