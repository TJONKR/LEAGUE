"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "danger" | "primary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg",
          {
            "bg-[#FFCC00] text-[#002266] hover:bg-[#FFD633] shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)]": variant === "default" || variant === "primary",
            "bg-transparent text-[#F5F7FA] border border-[#243B5C] hover:bg-[#132440] hover:border-[#FFCC00]/50": variant === "outline",
            "bg-transparent text-[#94A3B8] hover:text-[#F5F7FA] hover:bg-[#132440]": variant === "ghost",
            "bg-[#132440] text-[#F5F7FA] hover:bg-[#1A2D4D] border border-[#243B5C]": variant === "secondary",
            "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20": variant === "danger",
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
            "p-2": size === "icon",
          },
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
