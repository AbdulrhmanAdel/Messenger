import { Pipe, PipeTransform } from '@angular/core';
import {} from '../../../core/conversation';
import { ConversationModel } from '../../../core/conversation';

@Pipe({
  name: 'resolveMessageOwnerImage',
})
export class ResolveMessageOwnerImagePipe implements PipeTransform {
  transform(conversationModel: ConversationModel, senderId: string): unknown {
    return conversationModel.participants[senderId];
  }
}
