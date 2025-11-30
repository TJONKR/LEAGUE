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
          <label className="block text-sm font-medium text-[#FAFAFA]">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#111111] border border-[#262626] rounded-lg text-[#FAFAFA] placeholder:text-[#737373]",
            "focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/20",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#E53935]",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[#E53935]">{error}</p>}
        {hint && !error && <p className="text-sm text-[#737373]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };


