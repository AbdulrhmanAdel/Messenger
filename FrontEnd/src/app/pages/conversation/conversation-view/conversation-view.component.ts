import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../../core/conversation/services/message.service';
import { Store } from '@ngxs/store';
import { Subject, takeUntil, tap } from 'rxjs';
import { AuthState } from '../../../core/store/auth/auth.state';
import { ConversationModel } from '../../../core/conversation';
import { ConversationActions } from '../../../core/store/conversations/conversation.actions';

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss'],
})
export class ConversationViewComponent implements OnInit {
  isConversationStarted: boolean = false;
  selectedConversationModel: ConversationModel;
  @Input() set conversationModel(value: ConversationModel) {
    this.isConversationStarted = true;
    if (
      this.selectedConversationModel &&
      this.selectedConversationModel.id == value.id
    ) {
      return;
    }

    this.selectedConversationModel = value;
    this.refreshMessages();
  }

  loggedInUser: any;
  messages: string[];
  conversationData: { message?: string; senderId: string }[];

  @ViewChild('messageContainer') messageContainer: ElementRef;
  private _unsubscribe = new Subject<void>();
  constructor(
    private store: Store,
    private renderer: Renderer2,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.store
      .select(AuthState.loggedInUserData)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.loggedInUser = result))
      )
      .subscribe();

    this.refreshMessages();
  }

  refreshMessages() {
    this.messageService
      .getPagedList({
        conversationId: this.selectedConversationModel.id,
        pageSize: 30,
        currentPage: 1,
      })
      .pipe(
        tap((result) => {
          this.conversationData = result.data;

          // Wait till dom updated with messages
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

  sendMessage(message: string) {
    if (!message) return;

    this.store.dispatch(
      new ConversationActions.SendNewConversationMessage({
        conversationId: this.selectedConversationModel.id,
        message,
      })
    );
  }
}
