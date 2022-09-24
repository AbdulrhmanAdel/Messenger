import { ConversationNamePipe } from './conversation-name.pipe';

describe('ConversationNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ConversationNamePipe();
    expect(pipe).toBeTruthy();
  });
});
