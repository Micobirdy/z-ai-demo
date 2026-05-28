import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedDotPatternProps {
  width?: number;
  height?: number;
  cr?: number;
  flickerChance?: number;
  maxOpacity?: number;
  className?: string;
}

export function AnimatedDotPattern({
  width = 14,
  height = 14,
  cr = 1.2,
  flickerChance = 0.06,
  maxOpacity = 0.5,
  className,
}: AnimatedDotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cols = Math.floor(size.w / width);
    const rows = Math.floor(size.h / height);
    const opacities = Array.from({ length: cols * rows }, () => Math.random() * maxOpacity);
    const targets = Array.from({ length: cols * rows }, () => Math.random() * maxOpacity);

    let raf: number;
    let last = 0;
    let elapsed = 0;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return;
      const dt = last ? t - last : 16;
      last = t;
      elapsed += dt;

      ctx.clearRect(0, 0, size.w, size.h);
      const cx = size.w / 2;
      const cy = size.h / 2;
      const wavePhase = elapsed * 0.002;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const dotX = c * width + width / 2;
          const dotY = r * height + height / 2;

          // Faster lerp toward target
          opacities[idx] += (targets[idx] - opacities[idx]) * 0.15;

          // More frequent flicker
          if (Math.random() < flickerChance * 1.5) {
            targets[idx] = Math.random() * maxOpacity;
          }

          // Stronger radial wave pulse
          const dist = Math.sqrt((dotX - cx) ** 2 + (dotY - cy) ** 2);
          const wave = Math.sin(wavePhase * 3 - dist * 0.03) * 0.5 + 0.5;
          const finalOpacity = opacities[idx] * (0.4 + wave * 0.6);

          ctx.beginPath();
          ctx.arc(dotX, dotY, cr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 140, 140, ${finalOpacity})`;
          ctx.fill();
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size, width, height, cr, flickerChance, maxOpacity]);

  return (
    <div ref={containerRef} className={cn('size-full', className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
}

interface RippleDotPatternProps {
  width?: number;
  height?: number;
  cr?: number;
  baseOpacity?: number;
  rippleRadius?: number;
  peakOpacity?: number;
  className?: string;
}

export function RippleDotPattern({
  width = 18,
  height = 18,
  cr = 1.2,
  baseOpacity = 0.08,
  rippleRadius = 80,
  peakOpacity = 0.45,
  className,
}: RippleDotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cols = Math.floor(size.w / width);
    const rows = Math.floor(size.h / height);

    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, size.w, size.h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      if (mx < -rippleRadius && my < -rippleRadius) return;

      const cMin = Math.max(0, Math.floor((mx - rippleRadius) / width));
      const cMax = Math.min(cols - 1, Math.floor((mx + rippleRadius) / width));
      const rMin = Math.max(0, Math.floor((my - rippleRadius) / height));
      const rMax = Math.min(rows - 1, Math.floor((my + rippleRadius) / height));

      for (let c = cMin; c <= cMax; c++) {
        for (let r = rMin; r <= rMax; r++) {
          const dotX = c * width + width / 2;
          const dotY = r * height + height / 2;
          const dist = Math.sqrt((dotX - mx) ** 2 + (dotY - my) ** 2);

          if (dist >= rippleRadius) continue;

          const t = 1 - dist / rippleRadius;
          const opacity = baseOpacity + t * t * peakOpacity;

          ctx.beginPath();
          ctx.arc(dotX, dotY, cr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 140, 140, ${opacity})`;
          ctx.fill();
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size, width, height, cr, baseOpacity, rippleRadius, peakOpacity]);

  return (
    <div
      ref={containerRef}
      className={cn('size-full pointer-events-none', className)}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
