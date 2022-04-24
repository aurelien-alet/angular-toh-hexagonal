import { TestBed } from '@angular/core/testing';

import { MessageAdapterService } from './message-adapter.service';

describe('MessageAdapterService', () => {
  let service: MessageAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add new message', () => {
    let newMessage = "new message";
    service.add(newMessage);
    expect(service.messages).toEqual([newMessage]);
  });
  
  it('should clear messages', () => {
    service.messages = ["message 1", "message 2"];
    service.clear();
    expect(service.messages).toEqual([]);
  });
});
