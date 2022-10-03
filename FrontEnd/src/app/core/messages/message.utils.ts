import { chain, groupBy } from 'lodash';
import * as moment from 'moment';

export const groupMessagesByCreatedDate = function (
  messages: { created: Date; senderId: string }[]
) {

  const groupMessage = groupBy(messages, (m) => {
    const created = moment(m.created);
    return created.seconds(0).milliseconds(0);
  });

  return chain(Object.keys(groupMessage))
    .orderBy((m) => new Date(m), 'asc')
    .map((createdAtGroup) => {
      const messagesInGroup = groupMessage[createdAtGroup];
      let current: {
        senderId: string;
        messages: any[];
      } = { senderId: messagesInGroup[0].senderId, messages: [] };

      let messages = [current];

      chain(messagesInGroup)
        .forEach((m) => {
          if (m.senderId === current.senderId) {
            current.messages.push(m);
            return;
          }

          current = { senderId: m.senderId, messages: [m] };
          messages.push(current);
        })
        .value();

      return {
        created: createdAtGroup,
        groupedMessages: messages,
      };
    })
    .value();
};

