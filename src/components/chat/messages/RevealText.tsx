import { useState, useEffect, useRef } from 'react';

interface RevealTextProps {
  text: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export function RevealText({ text, speed = 30, className, style, onComplete }: RevealTextProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    if (revealedCount >= text.length) {
      doneRef.current = true;
      onComplete?.();
      return;
    }
    const t = setTimeout(() => {
      setRevealedCount(prev => Math.min(prev + 1 + Math.floor(Math.random() * 2), text.length));
    }, speed + Math.random() * speed * 0.4);
    return () => clearTimeout(t);
  }, [revealedCount, text, speed, onComplete]);

  const revealed = text.slice(0, revealedCount);
  const upcoming = text.slice(revealedCount, revealedCount + 3);
  const done = revealedCount >= text.length;

  return (
    <span className={className} style={style}>
      {revealed}
      {!done && (
        <>
          <span style={{ filter: 'blur(2px)', opacity: 0.5 }}>{upcoming.charAt(0)}</span>
          <span style={{ filter: 'blur(4px)', opacity: 0.3 }}>{upcoming.charAt(1)}</span>
          <span style={{ filter: 'blur(6px)', opacity: 0.15 }}>{upcoming.charAt(2)}</span>
        </>
      )}
    </span>
  );
}
