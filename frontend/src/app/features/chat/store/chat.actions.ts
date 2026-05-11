import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Message } from '../../../core/models/message.model';

export const ChatActions = createActionGroup({
  source: 'Chat',
  events: {
    'Init Conversation': props<{ conversationId: string }>(),

    'Send Message': props<{ content: string }>(),
    'Append User Message': props<{ message: Message }>(),

    'Stream Started': emptyProps(),
    'Stream Chunk Received': props<{ text: string }>(),
    'Stream Completed': props<{ assistantMessage: Message }>(),
    'Stream Failed': props<{ error: string }>(),

    'Load History': emptyProps(),
    'Load History Success': props<{ messages: Message[] }>(),
    'Load History Failure': props<{ error: string }>(),

    'Clear Conversation': emptyProps(),
    'Clear Conversation Success': emptyProps(),
  },
});
