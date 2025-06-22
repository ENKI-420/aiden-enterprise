import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "./design-system";

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  pulse?: boolean;
  glow?: boolean;
  ai?: boolean;
  healthcare?: boolean;
  defense?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      icon,
      iconPosition = "left",
      pulse = false,
      glow = false,
      ai = false,
      healthcare = false,
      defense = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Determine variant based on props
    let finalVariant = variant;
    if (ai) finalVariant = "ai";
    if (healthcare) finalVariant = "healthcare";
    if (defense) finalVariant = "defense";

    const buttonClasses = cn(
      buttonVariants({ variant: finalVariant, size, className }),
      {
        "animate-pulse": pulse,
        "shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]": glow,
        "shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]": ai && glow,
        "shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.8)]": healthcare && glow,
        "shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.8)]": defense && glow,
        "cursor-not-allowed opacity-50": disabled || loading,
      }
    );

    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner />
            {loadingText || children}
          </>
        );
      }

      if (icon) {
        const iconElement = <span className="flex-shrink-0">{icon}</span>;
        return (
          <>
            {iconPosition === "left" && iconElement}
            {children}
            {iconPosition === "right" && iconElement}
          </>
        );
      }

      return children;
    };

    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { buttonVariants, EnhancedButton };
