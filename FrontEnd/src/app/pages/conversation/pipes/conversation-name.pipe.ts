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
    const excludeLoggedInUser = Object.keys(
      conversationModel.participants
    ).filter((id) => id != loggedInUserId);

    // Private Conversation
    if (conversationModel.conversationType == 0) {
      const targetUser = excludeLoggedInUser[0];
      return this.getParticipantConversationName(
        conversationModel.participants[targetUser]
      );
    }

    // Group Conversation
    return (
      conversationModel.name ??
      excludeLoggedInUser
        .map((id) =>
          this.getParticipantConversationName(
            conversationModel.participants[id]
          )
        )
        .slice(0, 3)
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
