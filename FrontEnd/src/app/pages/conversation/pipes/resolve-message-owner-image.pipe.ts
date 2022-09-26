import { Pipe, PipeTransform } from '@angular/core';
import { ConversationModel } from '../../../core/conversation';

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
