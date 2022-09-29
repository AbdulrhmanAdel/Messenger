import { ConversationModel } from '../../conversation';

export interface ConversationStateModel {
  currentPage: number;
  pageSize: number;
  hasMoreData: boolean;
  conversationList: ConversationModel[];
  currentActiveConversationId: string | null;
}

export const DEFAULT_CONVERSATION_STATE: ConversationStateModel = {
  conversationList: [],
  currentPage: 1,
  hasMoreData: true,
  pageSize: 10,
  currentActiveConversationId: null,
};
