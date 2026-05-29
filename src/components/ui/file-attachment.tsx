import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface FileAttachmentProps {
  filename: string;
  size?: number;
  isImage?: boolean;
  url?: string;
  onRemove?: () => void;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type IconType = 'image' | 'code' | 'data' | 'text';

function getIconType(filename: string, isImage?: boolean): IconType {
  if (isImage) return 'image';
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['js','ts','jsx','tsx','py','rb','go','rs','java','kt','swift','c','cpp','h','cs','php'].includes(ext || '')) return 'code';
  if (['json','yaml','yml','xml'].includes(ext || '')) return 'data';
  return 'text';
}

function FileIcon({ type }: { type: IconType }) {
  const cls = "size-4 text-neutral-500 dark:text-neutral-400";
  switch (type) {
    case 'image':
      return <svg className={cls} viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1"/><path d="M2 11l3-3 2 2 3-3 4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'code':
      return <svg className={cls} viewBox="0 0 16 16" fill="none"><path d="M5.5 4.5L2.5 8l3 3.5M10.5 4.5L13.5 8l-3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'data':
      return <svg className={cls} viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 8h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
    default:
      return <svg className={cls} viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 2v3h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
  }
}

export function FileAttachment({ filename, size, isImage, url, onRemove, className }: FileAttachmentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const iconType = getIconType(filename, isImage);

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 pl-1 pr-2 py-1 min-w-[120px] max-w-[200px] rounded-[6px]",
        "bg-neutral-100/80 dark:bg-neutral-800/60",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isImage && url ? (
        <div className="w-8 self-stretch overflow-hidden shrink-0 rounded-[4px]">
          <img src={url} alt={filename} className="w-full h-full object-cover aspect-square" />
        </div>
      ) : (
        <div className="flex items-center justify-center w-8 self-stretch bg-neutral-200 dark:bg-neutral-700 shrink-0 rounded-[4px]">
          <FileIcon type={iconType} />
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate" title={filename}>
          {filename}
        </span>
        {size !== undefined && (
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {formatSize(size)}
          </span>
        )}
      </div>

      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className={cn(
            "absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700",
            "flex items-center justify-center transition-[opacity,transform] duration-150 ease-out active:scale-[0.97] z-10",
            "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100",
            isHovered ? "opacity-100" : "opacity-0",
          )}
          type="button"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
