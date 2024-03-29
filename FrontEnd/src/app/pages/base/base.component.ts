import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {RealtimeChatService} from '../../core/shared/services/realtime/realtime-chat.service';
import {Store} from '@ngxs/store';
import {AuthActions} from '../../core/store/auth';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {Router} from '@angular/router';
import {UserService} from '../../core/user/user.service';
import {ConversationModel} from '../../core/conversation';
import {AudioPlayerService} from '../../core/shared/services/audio-player.service';
import {AuthState} from '../../core/store/auth/auth.state';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserPreferencesComponent} from "../user-preferences/user-preferences.component";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {
  // Search
  search$ = new Subject<string>();
  searchValue = '';
  searchFocused: boolean;
  currentPage = 1;
  pageSize = 30;
  searchUserResult: any[];
  selectedConversation: ConversationModel;
  loggedInUser: any;

  @ViewChild('audioElement') audio: ElementRef;

  private _unsubscribe = new Subject<void>();

  constructor(
    public chatService: RealtimeChatService,
    private store: Store,
    private router: Router,
    private userService: UserService,
    private audioPlayService: AudioPlayerService,
    private dialogService: MatDialog
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.chatService.connect();
    this.store
      .select(AuthState.loggedInUserData)
      .pipe(
        takeUntil(this._unsubscribe),
        tap((result) => (this.loggedInUser = result))
      )
      .subscribe();

    this.audioPlayService.playMessageRequested$
      .pipe(
        takeUntil(this._unsubscribe),
        tap(() => this.audio.nativeElement.play())
      )
      .subscribe();

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          return this.userService.getPagedList({
            searchTerm: searchTerm,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          });
        }),
        tap((result) => {
          console.log(result);
        }),
        takeUntil(this._unsubscribe)
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

  openPreference() {
    this.dialogService.open(UserPreferencesComponent);
  }
}
