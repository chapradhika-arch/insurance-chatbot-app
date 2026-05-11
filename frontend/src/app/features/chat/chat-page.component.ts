import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ChatActions } from './store/chat.actions';
import {
  selectError,
  selectIsBusy,
  selectMessages,
  selectStreamingText,
} from './store/chat.selectors';
import { MessageListComponent } from './components/message-list.component';
import { InputBoxComponent } from './components/input-box.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MessageListComponent, InputBoxComponent],
  template: `
    <div class="page">
      <header>
        <div class="title">AccentInsure Assistant</div>
        <button class="clear" (click)="clear()">Clear chat</button>
      </header>

      <app-message-list
        [messages]="(messages$ | async) ?? []"
        [streamingText]="(streamingText$ | async) ?? ''"
      />

      @if (error$ | async; as err) {
        <div class="error">⚠ {{ err }}</div>
      }

      <app-input-box [busy]="(busy$ | async) ?? false" (send)="onSend($event)" />
    </div>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-width: 900px;
        margin: 0 auto;
        background: white;
        border-left: 1px solid #e5e7eb;
        border-right: 1px solid #e5e7eb;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: #1e3a8a;
        color: white;
      }
      .title {
        font-weight: 700;
        font-size: 16px;
      }
      .clear {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 12px;
      }
      .error {
        background: #fef2f2;
        color: #991b1b;
        padding: 8px 12px;
        font-size: 13px;
        border-top: 1px solid #fecaca;
      }
    `,
  ],
})
export class ChatPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly messages$ = this.store.select(selectMessages);
  readonly streamingText$ = this.store.select(selectStreamingText);
  readonly busy$ = this.store.select(selectIsBusy);
  readonly error$ = this.store.select(selectError);

  ngOnInit() {
    const conversationId =
      localStorage.getItem('conversationId') ?? crypto.randomUUID();
    localStorage.setItem('conversationId', conversationId);
    this.store.dispatch(ChatActions.initConversation({ conversationId }));
    this.store.dispatch(ChatActions.loadHistory());
  }

  onSend(content: string) {
    this.store.dispatch(ChatActions.sendMessage({ content }));
  }

  clear() {
    this.store.dispatch(ChatActions.clearConversation());
  }
}
