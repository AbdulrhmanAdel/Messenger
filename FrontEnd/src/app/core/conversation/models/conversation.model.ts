import {ConversationParticipantModel} from './conversation-participant.model';
import {arrayToObject} from '../../../pages/shared/utils/array.utils';

export class ConversationModel {
  id: string;
  participants: { [key: string]: ConversationParticipantModel };
  created: Date;
  updated: Date;
  name: string;
  conversationType: number;
  lastMessage: { messageText?: string, mediaUrls?: any[] };
  active: boolean;

  constructor(obj: any) {
    Object.assign(this, obj);

    this.participants = arrayToObject<any>(obj.participants, (p) => p.id);
  }
}
