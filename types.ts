
export interface Message {
  role: 'user' | 'ai' | 'error';
  content: string;
  timestamp: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
}
