import * as React from "react";
import { cn } from "@/lib/utils";
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-2xl border bg-card", props.className)} />;
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-4 border-b", props.className)} />;
}
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn("font-semibold", props.className)} />;
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-4", props.className)} />;
}
