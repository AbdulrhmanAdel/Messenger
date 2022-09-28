import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ConversationActions } from './conversation.actions';
import { ConversationStateModel } from './conversation.state.model';
import { ConversationService } from '../../conversation/services/conversation.service';
import { tap } from 'rxjs';
import produce from 'immer';
import { MessageService } from '../../conversation/services/message.service';
import { sortBy } from 'lodash';

const sendNewMessageHandler = (
  state: ConversationStateModel,
  action: ConversationActions.SendNewConversationMessage
): ConversationStateModel => {
  return produce(state, (draft) => {
    const targetConversation = draft.conversationList.find(
      (m) => m.id == action.conversationMessage.conversationId
    );

    // Load Conversation Data
    if (targetConversation) {
      const newList = sortBy(draft.conversationList, (p) =>
        p.id === action.conversationMessage.conversationId ? 0 : 1
      );
      newList[0].lastMessage = action.conversationMessage.message;
      return;
    }

    // Attach it to the start of it
  });
};

@State<ConversationStateModel>({
  name: 'conversations',
  defaults: {
    conversationList: [],
    currentPage: 1,
    hasMoreData: true,
    pageSize: 10,
  },
})
@Injectable()
export class ConversationState {
  constructor(
    private conversationService: ConversationService,
    private messageService: MessageService
  ) {}

  @Action(ConversationActions.LoadNextConversationPage)
  loadConversationPage(
    ctx: StateContext<ConversationStateModel>,
    action: ConversationActions.LoadNextConversationPage
  ) {
    return this.conversationService
      .getConversation({
        currentPage: action.query.currentPage,
        pageSize: action.query.pageSize,
      })
      .pipe(
        tap((result) => {
          ctx.setState(
            produce((draft) => {
              draft.hasMoreData = action.query.currentPage * action.query.pageSize < result.totalCount;
              draft.conversationList.push(...result.data);
            })
          );
        })
      );
  }

  @Action(ConversationActions.SendNewConversationMessage)
  sendMessageToConversation(
    ctx: StateContext<ConversationStateModel>,
    action: ConversationActions.SendNewConversationMessage
  ) {
    return this.messageService.sendMessage(action.conversationMessage).pipe(
      tap((result) => {
        const newState = sendNewMessageHandler(ctx.getState(), action);
        ctx.setState(newState);
      })
    );
  }
}
