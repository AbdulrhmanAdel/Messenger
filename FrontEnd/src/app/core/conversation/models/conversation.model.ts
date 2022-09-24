import { ConversationParticipantModel } from './conversation-participant.model';

export interface ConversationModel {
  id: string;
  participants: ConversationParticipantModel[];
  created: Date;
  updated: Date;
  name: string;
  conversationType: number;
  lastMessage: string;
  active: boolean;
}
