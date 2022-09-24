import { ConversationModel } from '../../conversation';

export interface ConversationStateModel {
  currentPage: number;
  pageSize: number;
  hasMoreData: boolean;
  conversationList: ConversationModel[];
}
