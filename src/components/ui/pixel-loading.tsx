import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const GAP = 5;
const SHIMMER_MS = 2000;
const IDLE_MS = 300;
const COLLAPSE_MS = 800;
const APPEAR_SPEED = 0.35;
const MAX_SIZE_HI = 2.8;

type Pixel = {
  x: number; y: number; color: string; dist: number;
  speed: number; size: number; sizeStep: number; minSize: number;
  maxSizeInt: number; maxSize: number; delay: number;
  counter: number; counterStep: number;
  isIdle: boolean; isReverse: boolean; isShimmer: boolean;
};

function rand(a: number, b: number) { return Math.random() * (b - a) + a; }

function buildPixels(W: number, H: number, colors: string[]): Pixel[] {
  const pixels: Pixel[] = [];
  const spd = 30 * 0.001;
  for (let x = 0; x < W; x += GAP) {
    for (let y = 0; y < H; y += GAP) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dx = x - W / 2, dy = y - H / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pixels.push({
        x, y, color, dist,
        speed: rand(0.1, 0.9) * spd,
        size: 0, sizeStep: Math.random() * 0.4, minSize: 0.5,
        maxSizeInt: Math.ceil(MAX_SIZE_HI), maxSize: rand(0.6, MAX_SIZE_HI),
        delay: dist, counter: 0,
        counterStep: (rand(0, 4) + (W + H) * 0.01) * APPEAR_SPEED,
        isIdle: false, isReverse: false, isShimmer: false,
      });
    }
  }
  return pixels;
}

function resetPixels(pixels: Pixel[]) {
  for (const p of pixels) { p.size = 0; p.counter = 0; p.isIdle = false; p.isReverse = false; p.isShimmer = false; }
}

function shimmerPx(p: Pixel) {
  if (p.size >= p.maxSize) p.isReverse = true;
  else if (p.size <= p.minSize) p.isReverse = false;
  p.size += p.isReverse ? -p.speed : p.speed;
}

function appearPx(p: Pixel) {
  p.isIdle = false;
  if (p.counter <= p.delay) { p.counter += p.counterStep; return; }
  if (p.size >= p.maxSize) p.isShimmer = true;
  if (p.isShimmer) shimmerPx(p); else p.size += p.sizeStep;
}

function disappearPx(p: Pixel, collapseR: number) {
  if (p.dist > collapseR) { p.size = 0; p.isIdle = true; return; }
  p.isShimmer = false; p.counter = 0;
  if (p.size <= 0) { p.isIdle = true; return; }
  p.size -= 0.12;
}

type Mode = 'idle' | 'appear' | 'shimmer' | 'disappear';

interface PixelLoadingProps {
  className?: string;
  colors?: string[];
  duration?: number;
  onComplete?: () => void;
}

export function PixelLoading({ className, colors, duration = 6000, onComplete }: PixelLoadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef(colors);
  const builtRef = useRef(false);
  const stateRef = useRef({
    pixels: [] as Pixel[], W: 0, H: 0, maxDist: 0,
    mode: 'idle' as Mode, shimmerTimer: 0, idleTimer: 0,
    collapseTimer: 0, collapseR: 0, raf: 0, last: 0,
    totalElapsed: 0, completed: false,
  });

  const build = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    if (builtRef.current) return;
    builtRef.current = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    const W = Math.floor(width), H = Math.floor(height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    const s = stateRef.current;
    s.W = W; s.H = H;
    s.maxDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2);
    s.pixels = buildPixels(W, H, colorsRef.current || ['#cccccc', '#aaaaaa', '#999999']);
  }, []);

  const tick = useCallback((now: number) => {
    const s = stateRef.current;
    s.raf = requestAnimationFrame(tick);
    const FPS = 1000 / 60;
    const dt = now - s.last;
    if (dt < FPS) return;
    s.last = now - dt % FPS;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, s.W, s.H);

    if (s.mode === 'idle') {
      resetPixels(s.pixels);
      s.mode = 'appear';
      return;
    }

    if (s.mode === 'appear') {
      let allShimmering = true;
      for (const p of s.pixels) { appearPx(p); if (!p.isShimmer) allShimmering = false; }
      if (allShimmering) { s.mode = 'shimmer'; }
    } else if (s.mode === 'shimmer') {
      for (const p of s.pixels) shimmerPx(p);
    }

    for (const p of s.pixels) {
      if (p.size > 0) {
        const off = p.maxSizeInt * 0.5 - p.size * 0.5;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + off, p.y + off, p.size, p.size);
      }
    }
  }, []);

  useEffect(() => {
    build();
    stateRef.current.raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => build());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => { cancelAnimationFrame(stateRef.current.raf); ro.disconnect(); };
  }, [build, tick]);

  return (
    <div ref={wrapRef} className={cn('absolute inset-0 overflow-hidden opacity-30', className)}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
