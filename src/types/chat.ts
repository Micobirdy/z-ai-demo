export interface PreviewFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export type MessageType = 'text' | 'thinking' | 'ppt-wizard' | 'generating' | 'ppt-slides' | 'ppt-summary' | 'ppt-actions' | 'tool-call';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: MessageType;
  files?: PreviewFile[];
  meta?: Record<string, unknown>;
  streaming?: boolean;
}

export interface PPTPreferences {
  audience: string;
  pageCount: string;
  style: string;
  notes: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  previewFiles: PreviewFile[];
}
