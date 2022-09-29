import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RealtimeChatService } from '../../core/shared/services/realtime/realtime-chat.service';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../core/store/auth';
import {
  debounceTime,
  fromEvent,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../core/user/user.service';
import { ConversationModel } from '../../core/conversation';
import { Immer } from 'immer';
import { AudioPlayerService } from '../../core/shared/services/audio-player.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {
  // Search
  search$ = new Subject<string>();
  searchFocused: boolean;
  searchUserResult: any[];
  selectedConversation: ConversationModel;

  @ViewChild('audioElement') audio: ElementRef;

  private _unsubscribe = new Subject<void>();
  constructor(
    public chatService: RealtimeChatService,
    private store: Store,
    private router: Router,
    private userService: UserService,
    private audioPlayService: AudioPlayerService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.chatService.connect();
    this.audioPlayService.playMessageRequested$
      .pipe(
        takeUntil(this._unsubscribe),
        tap(() => this.audio.nativeElement.play())
      )
      .subscribe();

    this.search$.pipe(
      debounceTime(300),
      tap((result) => (this.searchUserResult = [{}]))
    );

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
