import { Message } from '../../../core/models/message.model';

export type ChatStatus = 'idle' | 'sending' | 'streaming' | 'error';

export interface ChatState {
  conversationId: string;
  messages: Message[];
  streamingText: string;
  status: ChatStatus;
  error: string | null;
}

export const initialChatState: ChatState = {
  conversationId: '',
  messages: [],
  streamingText: '',
  status: 'idle',
  error: null,
};

export const CHAT_FEATURE_KEY = 'chat';
