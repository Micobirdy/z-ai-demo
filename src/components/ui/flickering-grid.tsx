import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  maxOpacity = 0.3,
  width,
  height,
  className,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: width || 0, height: height || 0 });

  const memoizedColor = useMemo(() => {
    const match = color.match(/[\d.]+/g);
    if (match && match.length >= 3) {
      return `${match[0]}, ${match[1]}, ${match[2]}`;
    }
    return '0, 0, 0';
  }, [color]);

  const setupGrid = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const cols = Math.floor(w / (squareSize + gridGap));
      const rows = Math.floor(h / (squareSize + gridGap));

      const ctx = canvas.getContext('2d');
      if (!ctx) return { cols: 0, rows: 0, opacities: [] as number[] };

      ctx.scale(dpr, dpr);

      const opacities = Array.from({ length: cols * rows }, () => Math.random() * maxOpacity);
      return { cols, rows, opacities };
    },
    [squareSize, gridGap, maxOpacity],
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasSize({
          width: width || entry.contentRect.width,
          height: height || entry.contentRect.height,
        });
      }
    });

    if (!width || !height) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

    const { cols, rows, opacities } = setupGrid(canvas, canvasSize.width, canvasSize.height);
    const ctx = canvas.getContext('2d');
    if (!ctx || cols === 0) return;

    let animationId: number;
    let lastTime = 0;
    const interval = 1000 / 15;

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);
      if (time - lastTime < interval) return;
      lastTime = time;

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;

          if (Math.random() < flickerChance) {
            opacities[idx] = Math.random() * maxOpacity;
          }

          ctx.fillStyle = `rgba(${memoizedColor}, ${opacities[idx]})`;
          ctx.fillRect(
            i * (squareSize + gridGap),
            j * (squareSize + gridGap),
            squareSize,
            squareSize,
          );
        }
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [canvasSize, setupGrid, flickerChance, maxOpacity, memoizedColor, squareSize, gridGap]);

  return (
    <div ref={containerRef} className={cn('size-full', className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
}
