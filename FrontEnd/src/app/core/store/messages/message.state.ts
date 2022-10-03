import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MessageStateModel } from './message-state.model';
import { MessageActions } from './message.actions';
import { MessageService } from '../../conversation';
import { tap } from 'rxjs';
import { A } from '@angular/cdk/keycodes';
import { groupMessagesByCreatedDate } from '../../messages/message.utils';

@State<MessageStateModel>({
  name: 'messages',
})
export class MessageState {
  constructor(private messageService: MessageService) {}
  @Action(MessageActions.LoadConversationMessages)
  loadMessages(
    ctx: StateContext<MessageStateModel>,
    action: MessageActions.LoadConversationMessages
  ) {
    return this.messageService
      .getPagedList({
        conversationId: action.conversationId,
        pageSize: 20,
        currentPage: 1,
      })
      .pipe(
        tap((result) => {
          ctx.setState({
            activeConversationId: action.conversationId,
            activeConversationMessages: groupMessagesByCreatedDate(result.data),
          });
        })
      );
  }

  static conversationMessages(state): [] {
    return state?.messages?.activeConversationMessages ?? [];
  }
}
