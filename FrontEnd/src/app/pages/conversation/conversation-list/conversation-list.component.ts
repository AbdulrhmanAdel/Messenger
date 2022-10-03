import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../../core/store/auth/auth.state';
import { ConversationModel } from '../../../core/conversation';
import { ConversationActions } from '../../../core/store/conversations/conversation.actions';
import { PagedQueryV1Model } from '../../../core/shared/models/requests/paged-query-v1.model';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
})
export class ConversationListComponent implements OnInit {
  @Input() hideConversations: boolean;
  @Output() selectedConversation = new EventEmitter<ConversationModel>();
  currentActiveConversation: ConversationModel;

  // Store
  @Select((state) => state.conversations.conversationList)
  conversations$: Observable<ConversationModel[]>;

  @Select((state) => state.conversations.hasMoreData)
  hasMoreConversations$: Observable<boolean>;

  loggedInUser: any;
  private _unsubscribe = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(AuthState.loggedInUserData)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.loggedInUser = result))
      )
      .subscribe();

    this.loadConversations();
  }

  loadConversations() {
    this.store.dispatch(
      new ConversationActions.LoadNextConversationPage(this.prepareQuery())
    );
  }

  currentPage = 1;
  pageSize = 20;

  loadNextPage() {
    this.currentPage += 1;
    this.loadConversations();
  }

  prepareQuery(): PagedQueryV1Model {
    return new PagedQueryV1Model({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  conversationClicked(conversation: ConversationModel) {
    this.selectedConversation.emit(conversation);
    if (!this.currentActiveConversation) {
      this.currentActiveConversation = conversation;
      return;
    }

    if (this.currentActiveConversation.id == conversation.id) return;

    this.currentActiveConversation.active = false;
    this.currentActiveConversation = conversation;
    this.currentActiveConversation.active = true;
  }
}
