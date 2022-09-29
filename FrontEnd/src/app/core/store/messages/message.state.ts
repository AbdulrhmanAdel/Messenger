import { State } from '@ngxs/store';
import { MessageStateModel } from './message-state.model';

@State<MessageStateModel>({
  name: 'messages',
  defaults: {},
})
export class MessageState {

}
