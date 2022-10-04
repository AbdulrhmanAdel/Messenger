import { Action, State, StateContext } from '@ngxs/store';
import { MessageStateModel } from './message-state.model';
import { MessageActions } from './message.actions';
import { tap } from 'rxjs';
import { groupMessagesByCreatedDate } from '../../messages/message.utils';
import { MessageService } from '../../messages/services/message.service';
import { Injectable } from '@angular/core';
import { ConversationActions } from '../conversations/conversation.actions';
import { ConversationStateModel } from '../conversations/conversation.state.model';
import * as moment from 'moment';
import produce from 'immer';
import { ConversationMessage } from '../../conversation';

@State<MessageStateModel>({
  name: 'messages',
})
@Injectable()
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

  @Action(ConversationActions.SendNewConversationMessage)
  sendMessage(
    ctx: StateContext<MessageStateModel>,
    action: ConversationActions.SendNewConversationMessage
  ) {
    this.handleNewMessage(ctx, action.conversationMessage);
  }

  @Action(ConversationActions.NewConversationMessageReceived)
  messageReceived(
    ctx: StateContext<MessageStateModel>,
    action: ConversationActions.NewConversationMessageReceived
  ) {
    this.handleNewMessage(ctx, action.conversationMessage);
  }
  static conversationMessages(state): [] {
    return state?.messages?.activeConversationMessages ?? [];
  }

  private handleNewMessage(
    ctx: StateContext<MessageStateModel>,
    conversationMessage: ConversationMessage
  ) {
    const currentState = ctx.getState();

    if (
      currentState.activeConversationId != conversationMessage.conversationId
    ) {
      return;
    }

    const newState = produce(currentState, (draft) => {
      const lastMessages =
        draft.activeConversationMessages[
          currentState.activeConversationMessages.length - 1
        ];
      const currentDate = moment().seconds(0).milliseconds(0);
      if (currentDate.isSame(lastMessages.created)) {
        const lastMessageInTheCurrentMinute =
          lastMessages.groupedMessages[lastMessages.groupedMessages.length - 1];

        if (
          lastMessageInTheCurrentMinute.senderId ===
          conversationMessage.senderId
        ) {
          lastMessageInTheCurrentMinute.messages.push({
            message: conversationMessage.message,
          });
        } else {
          lastMessages.groupedMessages.push({
            senderId: conversationMessage.senderId,
            messages: [
              {
                message: conversationMessage.message,
              },
            ],
          });
        }
      } else {
        draft.activeConversationMessages.push({
          created: currentDate.toISOString(),
          groupedMessages: [
            {
              senderId: conversationMessage.senderId,
              messages: [
                {
                  message: conversationMessage.message,
                },
              ],
            },
          ],
        });
      }
    });

    ctx.setState(newState);
  }
}
