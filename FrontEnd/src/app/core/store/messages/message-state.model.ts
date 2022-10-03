export interface MessageStateModel {
  activeConversationId: string;

  activeConversationMessages: {
    // Minute Range
    created: string;
    // All messages sent in that minute
    groupedMessages: GroupedMessage[];
  }[];
}

export class GroupedMessage {
  senderId: string;
  messages: { message: string }[];
}
