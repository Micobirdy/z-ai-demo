import { cn } from '@/lib/utils';

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedShinyText({ children, className, style }: AnimatedShinyTextProps) {
  return (
    <span
      className={cn('inline-block', className)}
      style={{
        backgroundImage: 'linear-gradient(90deg, var(--text-tertiary) 0%, var(--text-tertiary) 35%, var(--text-primary) 50%, var(--text-tertiary) 65%, var(--text-tertiary) 100%)',
        backgroundSize: '300% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shiny-text 6s linear infinite',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
