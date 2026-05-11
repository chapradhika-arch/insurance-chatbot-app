import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatHistoryDto } from '../models/message.model';

export interface ChatResponseDto {
  conversation_id: string;
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  send(conversationId: string, message: string): Observable<ChatResponseDto> {
    return this.http.post<ChatResponseDto>(`${this.base}/chat`, {
      conversation_id: conversationId,
      message,
    });
  }

  history(conversationId: string): Observable<ChatHistoryDto> {
    return this.http.get<ChatHistoryDto>(`${this.base}/history/${conversationId}`);
  }

  clear(conversationId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/history/${conversationId}`);
  }

  /**
   * Opens a Server-Sent Events stream for token-by-token replies.
   * Caller is responsible for closing the EventSource.
   */
  openStream(conversationId: string, message: string): EventSource {
    const params = new URLSearchParams({
      conversation_id: conversationId,
      message,
    });
    return new EventSource(`${this.base}/chat/stream?${params.toString()}`);
  }
}
