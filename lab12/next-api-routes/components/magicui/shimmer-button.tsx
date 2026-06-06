"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.1em",
  shimmerDuration = "1.5s",
  borderRadius = "8px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white",
        "[background:var(--bg)] [border-radius:var(--radius)]",
        "before:absolute before:inset-0 before:overflow-hidden before:[border-radius:var(--radius)]",
        "before:[background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]",
        "before:[translate:0_0] before:animate-[shimmer_var(--speed)_infinite]",
        "before:[mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "before:[mask-composite:intersect] before:[mask-clip:padding-box,border-box]",
        "after:absolute after:inset-[var(--cut)] after:[background:var(--bg)] after:[border-radius:calc(var(--radius)-var(--cut))]",
        "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
