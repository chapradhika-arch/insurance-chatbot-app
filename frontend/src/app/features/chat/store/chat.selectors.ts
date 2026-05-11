import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CHAT_FEATURE_KEY, ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>(CHAT_FEATURE_KEY);

export const selectMessages = createSelector(selectChatState, (s) => s.messages);
export const selectStreamingText = createSelector(selectChatState, (s) => s.streamingText);
export const selectStatus = createSelector(selectChatState, (s) => s.status);
export const selectError = createSelector(selectChatState, (s) => s.error);
export const selectConversationId = createSelector(selectChatState, (s) => s.conversationId);

export const selectIsBusy = createSelector(
  selectStatus,
  (status) => status === 'sending' || status === 'streaming',
);
