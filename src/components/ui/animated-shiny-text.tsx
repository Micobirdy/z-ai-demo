import { cn } from '@/lib/utils';

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedShinyText({ children, className }: AnimatedShinyTextProps) {
  return (
    <span
      className={cn(
        'bg-clip-text bg-no-repeat bg-gradient-to-r from-text-tertiary/60 via-text-primary/80 via-50% to-text-tertiary/60',
        className
      )}
      style={{
        backgroundSize: '200px 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shiny-text 3s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  );
}
