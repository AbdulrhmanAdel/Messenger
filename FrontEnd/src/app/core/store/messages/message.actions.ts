export namespace MessageActions {
  export class LoadConversationMessages {
    public static readonly type: string  = '[ConversationMessages] Load Messages';
    constructor(public conversationId: string) {}
  }
}
