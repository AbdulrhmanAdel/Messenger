import { Injectable } from '@angular/core';
import { Action, Select, State, StateContext } from '@ngxs/store';
import { ConversationActions } from './conversation.actions';
import { ConversationStateModel } from './conversation.state.model';
import { ConversationService } from '../../conversation/services/conversation.service';
import { tap } from 'rxjs';
import produce from 'immer';

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
  constructor(private conversationService: ConversationService) {}
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
          const state = ctx.getState();
          const newState = produce(state, (draft) => {
            draft.hasMoreData =
              action.query.currentPage * action.query.pageSize <
              result.totalCount;
            // draft.currentPage = currentPage;
            // draft.pageSize = pageSize;
            draft.conversationList.push(...result.data);
          });

          ctx.setState(newState);
        })
      );
  }
}
