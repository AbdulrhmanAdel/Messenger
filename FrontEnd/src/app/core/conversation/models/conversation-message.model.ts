export interface ConversationMessage {
  conversationId: string;
  senderId: string;
  message?: string;
  mediaUrls?: { url: string; type: number }[];
}
