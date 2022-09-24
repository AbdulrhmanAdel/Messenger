import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../../core/conversation/services/message.service';
import { Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { RealtimeChatService } from '../../../core/shared/services/realtime/realtime-chat.service';
import { AuthState } from '../../../core/store/auth/auth.state';
import { ConversationModel } from '../../../core/conversation';

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss'],
})
export class ConversationViewComponent implements OnInit {
  @Input() conversationModel: ConversationModel;

  loggedInUser: any;
  messages: string[];
  conversationData: { message?: string; senderId: string }[];

  private _unsubscribe = new Subject<void>();
  constructor(
    private store: Store,
    private messageService: MessageService,
    private chatService: RealtimeChatService
  ) {}

  ngOnInit(): void {
    this.store
      .select(AuthState.loggedInUserData)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.loggedInUser = result))
      )
      .subscribe();

    this.messageService
      .getPagedList({
        conversationId: this.conversationModel.id,
        pageSize: 30,
        currentPage: 1,
      })
      .pipe(
        tap((result) => {
          this.conversationData = result.data;
        })
      )
      .subscribe();

    this.chatService.messages$
      .pipe(
        tap((result) => {
          this.conversationData.push(result);
        })
      )
      .subscribe();
  }

  sendMessage(message: string) {
    this.messageService
      .sendMessage({
        conversationId: this.conversationModel.id,
        message,
      })
      .subscribe();

    this.conversationData.push({
      message: message,
      senderId: this.loggedInUser.id,
    });
  }
}
