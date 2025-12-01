import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

export function Container({ children, className, size = "lg" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", sizeClasses[size], className)}>
      {children}
    </div>
  );
}




