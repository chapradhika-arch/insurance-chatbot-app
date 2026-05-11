import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from '../../../core/models/message.model';
import { MessageBubbleComponent } from './message-bubble.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MessageBubbleComponent],
  template: `
    <div class="list">
      @for (m of messages(); track m.id) {
        <app-message-bubble [message]="m" />
      }
      @if (streamingText()) {
        <app-message-bubble
          [message]="{
            id: '__streaming__',
            role: 'assistant',
            content: streamingText(),
            createdAt: '',
          }"
        />
      }
      @if (!messages().length && !streamingText()) {
        <div class="empty">Ask anything about your policy, coverage, or claims to get started.</div>
      }
    </div>
  `,
  styles: [
    `
      .list {
        display: flex;
        flex-direction: column;
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        background: #f7f8fa;
      }
      .empty {
        text-align: center;
        color: #6b7280;
        padding: 40px 20px;
        font-size: 14px;
      }
    `,
  ],
})
export class MessageListComponent {
  readonly messages = input.required<Message[]>();
  readonly streamingText = input.required<string>();
}
