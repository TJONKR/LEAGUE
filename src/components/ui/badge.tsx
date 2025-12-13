import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "primary" | "success" | "warning";
  size?: "sm" | "default";
}

function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "bg-[#243B5C] text-[#F5F7FA]": variant === "default",
          "bg-transparent border border-[#243B5C] text-[#94A3B8]": variant === "outline",
          "bg-[#FFCC00]/15 text-[#FFCC00]": variant === "primary",
          "bg-[#10B981]/15 text-[#10B981]": variant === "success",
          "bg-[#F59E0B]/15 text-[#F59E0B]": variant === "warning",
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "default",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };




