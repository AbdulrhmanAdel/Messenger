import { Pipe, PipeTransform } from '@angular/core';
import {
  ConversationModel,
  ConversationParticipantModel,
} from '../../../core/conversation';

@Pipe({
  name: 'resolveConversationName',
})
export class ResolveConversationNamePipe implements PipeTransform {
  transform(
    conversationModel: ConversationModel,
    loggedInUserId: string
  ): unknown {
    const excludeLoggedInUser = conversationModel.participants.filter(
      (p) => p.id != loggedInUserId
    );

    // Private Conversation
    if (conversationModel.conversationType == 0) {
      const targetUser = excludeLoggedInUser[0];
      return this.getParticipantConversationName(targetUser);
    }

    // Group Conversation
    return (
      conversationModel.name ??
      excludeLoggedInUser
        .slice(0, 3)
        .map(this.getParticipantConversationName)
        .join(', ')
    );
  }

  private getParticipantConversationName(
    targetUser: ConversationParticipantModel
  ) {
    return (
      targetUser.nickName ?? targetUser.firstName + ' ' + targetUser.lastName
    );
  }
}
