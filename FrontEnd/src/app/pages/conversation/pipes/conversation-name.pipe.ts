import { Pipe, PipeTransform } from '@angular/core';
import {ConversationParticipantModel} from "../../../core/conversation";

@Pipe({
  name: 'conversationName',
})
export class ConversationNamePipe implements PipeTransform {
  transform(value: ConversationParticipantModel[], type: number, loggedInUserId: string): unknown {
    const excludeLoggedInUser = value.filter((p) => p.id != loggedInUserId);

    if (type == 0) {
      const targetUser = excludeLoggedInUser[0];
      return targetUser.firstName + ' ' + targetUser.lastName;
    }

    return 'group';
  }
}
