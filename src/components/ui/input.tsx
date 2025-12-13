import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = "text", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[#F5F7FA]">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#0F1D32] border border-[#243B5C] rounded-lg text-[#F5F7FA] placeholder:text-[#64748B]",
            "focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00]/20",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#EF4444]",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        {hint && !error && <p className="text-sm text-[#64748B]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };




