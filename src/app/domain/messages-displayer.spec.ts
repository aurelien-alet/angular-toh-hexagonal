import { TestBed } from '@angular/core/testing';

import MessageDisplayer from './messages-displayer';
import IManageMessages from './ports/i-manage-messages';

describe('MessageDisplayer', () => {
  let messageDisplayer: MessageDisplayer;
  let iManageMessagesSpy: jasmine.SpyObj<IManageMessages>;
  let currentMessages = ['A', 'B', 'C'];

  beforeEach(() => {
    iManageMessagesSpy = jasmine.createSpyObj('IManageMessages', ['messages', 'clear']);
    iManageMessagesSpy.messages = currentMessages;
    messageDisplayer = new MessageDisplayer(iManageMessagesSpy);
  });

  it('should get messages from adapter', () => {
    expect(messageDisplayer.messages).toEqual(currentMessages);
  });
  
  it('should ask messages clear', () => {
    messageDisplayer.askMessagesClear();
    expect(iManageMessagesSpy.clear).toHaveBeenCalledOnceWith();
  });
});
