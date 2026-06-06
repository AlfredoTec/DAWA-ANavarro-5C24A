"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NumberTicker({
  value,
  className,
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value === 0) {
        setDisplayed(0);
        return;
      }
      const duration = 900;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <span className={cn("tabular-nums", className)}>
      {displayed}
    </span>
  );
}
