import * as React from "react";
import { cn } from "@/lib/utils";
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn("block text-sm font-medium mb-1", className)} {...props} />;
}
