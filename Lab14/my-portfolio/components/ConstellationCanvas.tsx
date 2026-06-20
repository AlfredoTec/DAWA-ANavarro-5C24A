'use client';

import { useEffect, useRef } from 'react';

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas!.width  = wrap.offsetWidth;
      canvas!.height = wrap.offsetHeight;
    }
    resize();

    const N = 55;
    const D = 110;
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * canvas!.width,
      y:  Math.random() * canvas!.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  0.8 + Math.random() * 2,
    }));

    let raf: number;

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      const light = document.documentElement.classList.contains('light');
      const nodeColor = light ? 'rgba(2,132,199,.65)'  : 'rgba(56,189,248,.75)';
      const lineRgb   = light ? '2,132,199'            : '56,189,248';

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < D) {
            ctx.strokeStyle = `rgba(${lineRgb},${0.35 * (1 - d / D)})`;
            ctx.lineWidth   = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
