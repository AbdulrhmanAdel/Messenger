import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../store/auth/auth.state';
import { Subject } from 'rxjs';

const hostUrl = environment.hostUrl;
@Injectable({
  providedIn: 'root',
})
export class RealtimeChatService {
  private messages$ = new Subject<void>();
  private hub: HubConnection;

  constructor(private store: Store) {}
  async connect() {
    if (this.hub) {
      return;
    }

    const token = this.store.selectSnapshot(AuthState.userAccessToken);
    console.log(token);
    this.hub = new HubConnectionBuilder()
      .withUrl(hostUrl + '/chat', {
        accessTokenFactory: () => (token ? token : ''),
      })
      .build();

    this.hub.start().then(console.log).catch(console.log);
    this.hub.on('newMessage', (data) => {
      console.log(data);
    });
  }

  async send(to: string, data: any) {
    const id = this.store.selectSnapshot(state => state.auth.userDetails.id);
    await this.hub.send(
      'SendMessage',
      id,
      data
    );
  }
}
