import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-box',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <form class="row" (submit)="submit($event)">
      <textarea
        rows="1"
        placeholder="Ask about premiums, claims, coverage..."
        [(ngModel)]="text"
        name="message"
        [disabled]="busy()"
        (keydown.enter)="onEnter($event)"
      ></textarea>
      <button type="submit" [disabled]="busy() || !text().trim()">
        {{ busy() ? '...' : 'Send' }}
      </button>
    </form>
  `,
  styles: [
    `
      .row {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: #ffffff;
        border-top: 1px solid #e5e7eb;
      }
      textarea {
        flex: 1;
        resize: none;
        font: inherit;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        outline: none;
      }
      textarea:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      }
      button {
        padding: 0 18px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class InputBoxComponent {
  readonly busy = input.required<boolean>();
  readonly send = output<string>();

  text = signal('');

  submit(ev: Event) {
    ev.preventDefault();
    const value = this.text().trim();
    if (!value || this.busy()) return;
    this.send.emit(value);
    this.text.set('');
  }

  onEnter(ev: Event) {
    const ke = ev as KeyboardEvent;
    if (!ke.shiftKey) {
      this.submit(ev);
    }
  }
}
