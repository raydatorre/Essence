import * as React from "react";
import { cn } from "@/lib/utils";
export function Card(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={cn("rounded-2xl border bg-card", p.className)} />; }
export function CardHeader(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={cn("p-4 border-b", p.className)} />; }
export function CardTitle(p: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 {...p} className={cn("font-semibold", p.className)} />; }
export function CardContent(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={cn("p-4", p.className)} />; }
