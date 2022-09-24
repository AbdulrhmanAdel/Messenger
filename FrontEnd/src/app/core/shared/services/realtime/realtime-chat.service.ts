import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../store/auth/auth.state';
import { Observable, Subject, take } from 'rxjs';

export interface Message {
  conversationId: string;
  senderId: string;
  message: string;
  mediaUrls?: { url: string; type: number }[];
}

const hostUrl = environment.hostUrl;
@Injectable({
  providedIn: 'root',
})
export class RealtimeChatService {
  messages$: Observable<Message>;
  private messagesSubject = new Subject<Message>();

  private hub: HubConnection;
  constructor(private store: Store) {
    this.messages$ = this.messagesSubject;
  }

  async connect() {
    if (this.hub) {
      return;
    }

    const token = this.store.selectSnapshot(AuthState.userAccessToken);
    this.hub = new HubConnectionBuilder()
      .withUrl(hostUrl + '/chat', {
        accessTokenFactory: () => (token ? token : ''),
      })
      .build();

    await this.hub.start();
    this.hub.on('newMessage', (data: Message) => {
      this.messagesSubject.next(data);
    });
  }

  async disconnect() {
    await this.hub.stop();
  }
}
