export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackGiven?: 'yes' | 'no';
  isStatusMessage?: boolean;
  statusType?: 'loading' | 'success' | 'error' | 'warning' | 'info';
}

export interface SendMessageParams {
  history: Message[];
  prompt: string;
  imageBase64?: string;
  mimeType?: string;
}
