import { Pipe, PipeTransform } from '@angular/core';
import {  } from '../../../core/conversation';
import {ConversationModel} from "../../../core/conversation/models/conversation.model";

@Pipe({
  name: 'resolveMessageOwnerImage',
})
export class ResolveMessageOwnerImagePipe implements PipeTransform {
  transform(
    conversationModel: ConversationModel,
    senderId: string
  ): unknown {
    const owner = conversationModel.participants.find(
      (m) => m.id == senderId
    );
    return owner?.profilePicture;
  }
}
