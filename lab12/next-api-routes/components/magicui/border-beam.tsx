"use client";

import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  bgColor?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = "#22c55e",
  colorTo = "#3b82f6",
  bgColor = "#ffffff",
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--bg": bgColor,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--size)*0.005px)_solid_transparent]",
        "[background:linear-gradient(var(--bg),var(--bg))_padding-box,linear-gradient(calc(var(--angle)*1deg),var(--color-from),var(--color-to))_border-box]",
        "[animation:border-beam_calc(var(--duration)*1s)_calc(var(--delay))_infinite_linear]",
        className
      )}
    />
  );
}
