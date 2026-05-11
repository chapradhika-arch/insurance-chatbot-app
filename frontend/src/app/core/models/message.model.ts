export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  pending?: boolean;
}

export interface ChatHistoryDto {
  conversation_id: string;
  messages: { role: Role; content: string; created_at: string }[];
}
