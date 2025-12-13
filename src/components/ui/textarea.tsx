import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[#F5F7FA]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#0F1D32] border border-[#243B5C] rounded-lg text-[#F5F7FA] placeholder:text-[#64748B]",
            "focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00]/20",
            "transition-colors duration-200 min-h-[120px] resize-y",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#EF4444]",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };




