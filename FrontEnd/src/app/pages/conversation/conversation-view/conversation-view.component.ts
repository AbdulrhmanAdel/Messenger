import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ConversationModel } from '../../../core/conversation';
import { Store } from '@ngxs/store';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';
import { AuthState } from '../../../core/store/auth/auth.state';
import { ConversationActions } from '../../../core/store/conversations/conversation.actions';
import { MessageState } from '../../../core/store/messages/message.state';
import { MessageActions } from '../../../core/store/messages/message.actions';

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss'],
})
export class ConversationViewComponent implements OnInit {
  console = console;
  selectedConversationModel: ConversationModel;
  @Input() set selectedConversation(value: ConversationModel) {
    this.selectedConversationChanged(value);
  }

  loggedInUserInfo: { id: string };

  conversationMessages: {
    created: any;
    groupedMessages: { senderId: string; messages: any[] }[];
  }[];

  showConversationDetails: boolean = false;

  messageText: string;

  @ViewChild('messageContainer') messageContainer: ElementRef;

  // Clean Up
  private _unsubscribe = new Subject<void>();
  private messagesInStoreSubscription: Subscription;
  constructor(private store: Store, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.store
      .select(AuthState.loggedInUserData)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.loggedInUserInfo = result))
      )
      .subscribe();

    this.loadMessages();
    this.listenForMessagesChanges();
  }

  loadMessages() {
    if (this.selectedConversationModel?.id) {
      this.store.dispatch(
        new MessageActions.LoadConversationMessages(
          this.selectedConversationModel.id
        )
      );
    }
  }

  private listenForMessagesChanges() {
    this.messagesInStoreSubscription = this.store
      .select(MessageState.conversationMessages)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => {
          this.conversationMessages = result;

          // Wait till dom updated with messages then scroll down
          setTimeout(() => {
            this.renderer.setProperty(
              this.messageContainer.nativeElement,
              'scrollTop',
              this.messageContainer.nativeElement.scrollHeight
            );
          });
        })
      )
      .subscribe();
  }

  selectedConversationChanged(newSelectedConversation: ConversationModel) {
    if (
      this.selectedConversationModel &&
      this.selectedConversationModel.id == newSelectedConversation.id
    ) {
      return;
    }

    this.selectedConversationModel = newSelectedConversation;
    this.loadMessages();
  }

  sendMessage() {
    if (!this.messageText) return;

    this.store.dispatch(
      new ConversationActions.SendNewConversationMessage({
        conversationId: this.selectedConversationModel.id,
        message: this.messageText,
        senderId: this.loggedInUserInfo.id,
      })
    );

    this.messageText = '';
  }

  loadNextPage() {}
}
