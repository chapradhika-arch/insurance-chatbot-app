import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, catchError, concat, map, merge, of, switchMap, withLatestFrom } from 'rxjs';
import { Message } from '../../../core/models/message.model';
import { ChatApiService } from '../../../core/services/chat-api.service';
import { ChatActions } from './chat.actions';
import { selectConversationId } from './chat.selectors';

function uuid(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

@Injectable()
export class ChatEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ChatApiService);

  /**
   * On a Send Message action: append the user's message, mark stream started,
   * then merge in the SSE-driven actions until the stream completes.
   */
  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      withLatestFrom(this.store.select(selectConversationId)),
      switchMap(([{ content }, conversationId]) => {
        const userMessage: Message = {
          id: uuid(),
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        };
        return concat(
          of<Action>(ChatActions.appendUserMessage({ message: userMessage })),
          of<Action>(ChatActions.streamStarted()),
          this.streamAsObservable(conversationId, content),
        );
      }),
    ),
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadHistory),
      withLatestFrom(this.store.select(selectConversationId)),
      switchMap(([, conversationId]) =>
        this.api.history(conversationId).pipe(
          map((dto) =>
            ChatActions.loadHistorySuccess({
              messages: dto.messages.map((m) => ({
                id: uuid(),
                role: m.role,
                content: m.content,
                createdAt: m.created_at,
              })),
            }),
          ),
          catchError((err) =>
            of(ChatActions.loadHistoryFailure({ error: String(err?.message ?? err) })),
          ),
        ),
      ),
    ),
  );

  clearConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.clearConversation),
      withLatestFrom(this.store.select(selectConversationId)),
      switchMap(([, conversationId]) =>
        this.api.clear(conversationId).pipe(
          map(() => ChatActions.clearConversationSuccess()),
          catchError(() => of(ChatActions.clearConversationSuccess())),
        ),
      ),
    ),
  );

  private streamAsObservable(conversationId: string, content: string): Observable<Action> {
    return new Observable<Action>((subscriber) => {
      const es = this.api.openStream(conversationId, content);
      let buffer = '';

      es.addEventListener('chunk', (ev: MessageEvent) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.text) {
            buffer += data.text;
            subscriber.next(ChatActions.streamChunkReceived({ text: data.text }));
          }
        } catch {
          /* ignore malformed chunk */
        }
      });

      es.addEventListener('done', () => {
        const assistantMessage: Message = {
          id: uuid(),
          role: 'assistant',
          content: buffer,
          createdAt: new Date().toISOString(),
        };
        subscriber.next(ChatActions.streamCompleted({ assistantMessage }));
        subscriber.complete();
        es.close();
      });

      es.addEventListener('error', () => {
        subscriber.next(ChatActions.streamFailed({ error: 'Stream connection error' }));
        subscriber.complete();
        es.close();
      });

      return () => es.close();
    });
  }
}
