import { useState, useEffect, useRef } from 'react';

interface StreamingTextProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function StreamingText({ content, speed = 20, onComplete, className, style }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    indexRef.current = 0;
    doneRef.current = false;
    setDisplayed('');
  }, [content]);

  useEffect(() => {
    if (doneRef.current) return;

    if (indexRef.current >= content.length) {
      doneRef.current = true;
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      const charsPerTick = Math.max(1, Math.floor(Math.random() * 3) + 1);
      const next = Math.min(indexRef.current + charsPerTick, content.length);
      indexRef.current = next;
      setDisplayed(content.slice(0, next));
    }, speed + Math.random() * speed * 0.5);

    return () => clearTimeout(timer);
  }, [displayed, content, speed, onComplete]);

  return (
    <p className={className} style={style}>
      {displayed}
      {indexRef.current < content.length && (
        <span className="inline-block w-[2px] h-[14px] bg-text-tertiary/60 align-middle ml-0.5 animate-pulse" />
      )}
    </p>
  );
}
