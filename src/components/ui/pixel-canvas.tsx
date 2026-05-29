import { useCallback, useEffect, useRef } from 'react';

type Pixel = {
  x: number; y: number; color: string; ctx: CanvasRenderingContext2D;
  speed: number; size: number; sizeStep: number; minSize: number;
  maxSizeInt: number; maxSize: number; delay: number; counter: number;
  counterStep: number; isIdle: boolean; isReverse: boolean; isShimmer: boolean;
  draw: () => void; appear: () => void; disappear: () => void; shimmer: () => void;
};

function createPixel(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, x: number, y: number, color: string, baseSpeed: number, delay: number): Pixel {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const p: Pixel = {
    x, y, color, ctx, speed: rand(0.1, 0.9) * baseSpeed,
    size: 0, sizeStep: Math.random() * 0.4, minSize: 0.5, maxSizeInt: 2,
    maxSize: rand(0.5, 2), delay, counter: 0,
    counterStep: Math.random() * 4 + (canvas.width + canvas.height) * 0.01,
    isIdle: false, isReverse: false, isShimmer: false,
    draw() { const o = p.maxSizeInt * 0.5 - p.size * 0.5; ctx.fillStyle = p.color; ctx.fillRect(p.x + o, p.y + o, p.size, p.size); },
    appear() { p.isIdle = false; if (p.counter <= p.delay) { p.counter += p.counterStep; return; } if (p.size >= p.maxSize) p.isShimmer = true; if (p.isShimmer) p.shimmer(); else p.size += p.sizeStep; p.draw(); },
    disappear() { p.isShimmer = false; p.counter = 0; if (p.size <= 0) { p.isIdle = true; return; } p.size -= 0.1; p.draw(); },
    shimmer() { if (p.size >= p.maxSize) p.isReverse = true; else if (p.size <= p.minSize) p.isReverse = false; if (p.isReverse) p.size -= p.speed; else p.size += p.speed; },
  };
  return p;
}

interface PixelCanvasProps { colors: string[]; gap?: number; speed?: number; }

export function PixelCanvas({ colors, gap = 5, speed = 30 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef(performance.now());

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.floor(width); const h = Math.floor(height);
    canvas.width = w; canvas.height = h;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    const effectiveSpeed = Math.min(speed, 100) * 0.001;
    const pixels: Pixel[] = [];
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dx = x - w / 2; const dy = y - h / 2;
        const delay = Math.sqrt(dx * dx + dy * dy);
        pixels.push(createPixel(ctx, canvas, x, y, color, effectiveSpeed, delay));
      }
    }
    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((mode: 'appear' | 'disappear') => {
    cancelAnimationFrame(animationRef.current);
    const loop = () => {
      animationRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      if (now - lastFrameRef.current < 16.67) return;
      lastFrameRef.current = now;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const pixel of pixelsRef.current) pixel[mode]();
      if (pixelsRef.current.every(p => p.isIdle)) cancelAnimationFrame(animationRef.current);
    };
    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    init();
    const ro = new ResizeObserver(() => init());
    if (wrapRef.current) ro.observe(wrapRef.current);
    const card = wrapRef.current?.parentElement;
    const handleEnter = () => animate('appear');
    const handleLeave = () => animate('disappear');
    card?.addEventListener('mouseenter', handleEnter);
    card?.addEventListener('mouseleave', handleLeave);
    return () => { ro.disconnect(); cancelAnimationFrame(animationRef.current); card?.removeEventListener('mouseenter', handleEnter); card?.removeEventListener('mouseleave', handleLeave); };
  }, [init, animate]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
