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
          "bg-[#262626] text-[#FAFAFA]": variant === "default",
          "bg-transparent border border-[#262626] text-[#A1A1A1]": variant === "outline",
          "bg-[#E53935]/15 text-[#E53935]": variant === "primary",
          "bg-[#22C55E]/15 text-[#22C55E]": variant === "success",
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

