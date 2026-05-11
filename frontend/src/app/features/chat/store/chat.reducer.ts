import { createReducer, on } from '@ngrx/store';
import { ChatActions } from './chat.actions';
import { ChatState, initialChatState } from './chat.state';

export const chatReducer = createReducer<ChatState>(
  initialChatState,

  on(ChatActions.initConversation, (state, { conversationId }) => ({
    ...state,
    conversationId,
  })),

  on(ChatActions.appendUserMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    status: 'sending',
    error: null,
  })),

  on(ChatActions.streamStarted, (state) => ({
    ...state,
    status: 'streaming',
    streamingText: '',
  })),

  on(ChatActions.streamChunkReceived, (state, { text }) => ({
    ...state,
    streamingText: state.streamingText + text,
  })),

  on(ChatActions.streamCompleted, (state, { assistantMessage }) => ({
    ...state,
    messages: [...state.messages, assistantMessage],
    streamingText: '',
    status: 'idle',
  })),

  on(ChatActions.streamFailed, (state, { error }) => ({
    ...state,
    status: 'error',
    streamingText: '',
    error,
  })),

  on(ChatActions.loadHistorySuccess, (state, { messages }) => ({
    ...state,
    messages,
    status: 'idle',
  })),

  on(ChatActions.loadHistoryFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error,
  })),

  on(ChatActions.clearConversationSuccess, (state) => ({
    ...initialChatState,
    conversationId: state.conversationId,
  })),
);
