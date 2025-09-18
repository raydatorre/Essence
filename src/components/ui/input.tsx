import * as React from "react";
import { cn } from "@/lib/utils";
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border px-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
