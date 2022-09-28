import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../store/auth/auth.state';
import { ConversationActions } from '../../../store/conversations/conversation.actions';
import { ConversationMessage } from '../../../conversation';

const hostUrl = environment.hostUrl;
@Injectable({
  providedIn: 'root',
})
export class RealtimeChatService {
  private hub: HubConnection;
  constructor(private store: Store) {}

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
    this.hub.on('newMessage', (data: ConversationMessage) => {
      this.store.dispatch(
        new ConversationActions.NewConversationMessageReceived(data)
      );
    });
  }

  async disconnect() {
    await this.hub.stop();
  }
}
