import * as React from "react";
import { cn } from "@/lib/utils";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
    const variants = {
      default: "bg-primary text-white hover:opacity-90 focus:ring-primary",
      outline: "border border-primary text-primary hover:bg-primary/5 focus:ring-primary",
      secondary: "bg-card text-foreground border hover:bg-muted",
      ghost: "text-foreground hover:bg-muted",
    };
 const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-4", lg: "h-12 px-5 text-lg" };
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
  }
);
Button.displayName = "Button";
