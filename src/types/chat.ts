export interface PreviewFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  files?: PreviewFile[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  previewFiles: PreviewFile[];
}
