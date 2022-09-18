import { Component, OnInit } from '@angular/core';
import { RealtimeChatService } from '../../core/shared/services/realtime/realtime-chat.service';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../core/store/auth';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  constructor(
    public chatService: RealtimeChatService,
    private store: Store,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.chatService.connect();
  }

  private _unsubscribe = new Subject<void>();
  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  send(value: string) {
    console.log(value);
    this.chatService.send('', value);
  }

  logout() {
    this.store
      .dispatch(new AuthActions.LoggedOutRequested())
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this.router.navigateByUrl('auth/login'));
  }
}
