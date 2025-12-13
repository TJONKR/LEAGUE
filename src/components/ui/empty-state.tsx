import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="mb-4">
          <Icon className="w-12 h-12 text-[#64748B]" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-[#F5F7FA] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#64748B] mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
}




