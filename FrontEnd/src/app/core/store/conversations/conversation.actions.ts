import { PagedQueryV1Model } from '../../shared/models/requests/paged-query-v1.model';
import { ConversationMessage } from '../../conversation';

export namespace ConversationActions {
  export class LoadNextConversationPage {
    public static readonly type: string = '[Conversation] Load Next Page';
    constructor(public query: PagedQueryV1Model) {}
  }

  export class SendNewConversationMessage {
    public static readonly type: string = '[Conversation] Send Message';
    constructor(
      public conversationMessage: {
        conversationId: string;
        message: string;
      }
    ) {}
  }

  export class NewConversationMessageReceived {
    public static readonly type: string = '[Conversation] Message Received';
    constructor(public conversationMessage: ConversationMessage) {}
  }
}
