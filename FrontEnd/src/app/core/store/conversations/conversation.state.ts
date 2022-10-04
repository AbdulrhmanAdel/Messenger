import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { ConversationActions } from './conversation.actions';
import {
  ConversationStateModel,
  DEFAULT_CONVERSATION_STATE,
} from './conversation.state.model';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import produce from 'immer';
import {
  ConversationService,
  ConversationModel,
} from '../../conversation';
import { sortBy } from 'lodash';
import { AudioPlayerService } from '../../shared/services/audio-player.service';
import {MessageService} from "../../messages/services/message.service";

@State<ConversationStateModel>({
  name: 'conversations',
  defaults: DEFAULT_CONVERSATION_STATE,
})
@Injectable()
export class ConversationState {
  constructor(
    private conversationService: ConversationService,
    private messageService: MessageService,
    private audio: AudioPlayerService
  ) {}

  @Action(ConversationActions.LoadNextConversationPage)
  loadConversationPage(
    ctx: StateContext<ConversationStateModel>,
    action: ConversationActions.LoadNextConversationPage
  ) {
    return this.conversationService
      .getPagedList({
        currentPage: action.query.currentPage,
        pageSize: action.query.pageSize,
      })
      .pipe(
        tap((result) => {
          ctx.setState(
            produce((draft) => {
              draft.hasMoreData =
                action.query.currentPage * action.query.pageSize <
                result.totalCount;
              draft.conversationList.push(
                ...result.data.map((c) => new ConversationModel(c))
              );
            })
          );
        })
      );
  }

  @Action(ConversationActions.SendNewConversationMessage)
  sendMessage(
    ctx: StateContext<ConversationStateModel>,
    action: ConversationActions.SendNewConversationMessage
  ) {
    return this.messageService.sendMessage(action.conversationMessage).pipe(
      switchMap((result): Observable<any> => {
        const currentState = ctx.getState();
        const targetConversation = currentState.conversationList.find(
          (m) => m.id == action.conversationMessage.conversationId
        );

        if (targetConversation) {
          return of({ targetConversation, requestedFromServer: false });
        }

        return this.conversationService
          .getById(action.conversationMessage.conversationId)
          .pipe(
            map((getByIdResult) => ({
              targetConversation: new ConversationModel(getByIdResult.data),
              requestedFromServer: true,
            }))
          );
      }),
      tap(this.handleNewConversationMessage(ctx, action.conversationMessage))
    );
  }

  @Action(ConversationActions.NewConversationMessageReceived)
  messageReceived(
    ctx: StateContext<ConversationStateModel>,
    action: ConversationActions.NewConversationMessageReceived
  ) {
    const currentState = ctx.getState();
    const targetConversation = currentState.conversationList.find(
      (m) => m.id == action.conversationMessage.conversationId
    );

    let conversation$: Observable<any>;
    if (targetConversation) {
      conversation$ = of({ targetConversation, requestedFromServer: false });
    } else {
      conversation$ = this.conversationService
        .getById(action.conversationMessage.conversationId)
        .pipe(
          map((getByIdResult) => ({
            targetConversation: new ConversationModel(getByIdResult.data),
            requestedFromServer: true,
          }))
        );
    }

    return conversation$.pipe(
      tap(this.handleNewConversationMessage(ctx, action.conversationMessage)),
      tap(() => this.audio.play())
    );
  }

  private handleNewConversationMessage(
    ctx: StateContext<ConversationStateModel>,
    message: { message?: string; mediaUrl?: any[] }
  ) {
    return (result) =>
      ctx.setState(
        produce((draft) => {
          if (result.requestedFromServer) {
            draft.conversationList.unshift(result.targetConversation);
          } else {
            draft.conversationList = sortBy(draft.conversationList, (p) =>
              p.id === result.targetConversation.id ? 0 : 1
            );
            draft.conversationList[0].lastMessage = {
              messageText: message.message,
              mediaUrls: message.mediaUrl,
            };
          }
        })
      );
  }
}
