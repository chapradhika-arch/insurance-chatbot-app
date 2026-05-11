import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bubble" [class.user]="message().role === 'user'" [class.assistant]="message().role === 'assistant'">
      <div class="role">{{ message().role === 'user' ? 'You' : 'AccentInsure' }}</div>
      <div class="content">{{ message().content }}</div>
    </div>
  `,
  styles: [
    `
      .bubble {
        max-width: 75%;
        padding: 10px 14px;
        margin: 6px 0;
        border-radius: 12px;
        line-height: 1.45;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .user {
        align-self: flex-end;
        background: #2563eb;
        color: white;
        border-bottom-right-radius: 2px;
      }
      .assistant {
        align-self: flex-start;
        background: #ffffff;
        color: #111827;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 2px;
      }
      .role {
        font-size: 11px;
        opacity: 0.75;
        margin-bottom: 4px;
        font-weight: 600;
      }
    `,
  ],
})
export class MessageBubbleComponent {
  readonly message = input.required<Message>();
}
