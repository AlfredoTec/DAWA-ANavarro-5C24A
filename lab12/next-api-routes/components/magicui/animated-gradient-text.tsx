"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "animate-gradient bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
