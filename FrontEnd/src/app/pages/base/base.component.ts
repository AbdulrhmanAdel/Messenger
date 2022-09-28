import { Component, OnDestroy, OnInit } from '@angular/core';
import { RealtimeChatService } from '../../core/shared/services/realtime/realtime-chat.service';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../core/store/auth';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../core/user/user.service';
import { ConversationModel } from '../../core/conversation';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {
  searchFocused: boolean;

  searchUserResult: any[];
  conversation: ConversationModel;

  private _unsubscribe = new Subject<void>();
  constructor(
    public chatService: RealtimeChatService,
    private store: Store,
    private router: Router,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.chatService.connect();

    this.userService
      .getPagedList()
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.searchUserResult = result.data))
      )
      .subscribe();
  }

  async ngOnDestroy(): Promise<void> {
    await this.chatService.disconnect();
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  logout() {
    this.store
      .dispatch(new AuthActions.LoggedOutRequested())
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this.router.navigateByUrl('auth/login'));
  }
}
