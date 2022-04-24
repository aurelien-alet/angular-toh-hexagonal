import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import IDisplayMessages from 'src/app/domain/ports/i-display-messages';

import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let spyIDisplayMessages: jasmine.SpyObj<IDisplayMessages>;

  beforeEach(async () => {
    spyIDisplayMessages = jasmine.createSpyObj(
      'IDisplayMessages', 
      ['askMessagesClear'], 
      {messages: ["one message"]}
    );
    spyIDisplayMessages.askMessagesClear.and.returnValue();
    
    await TestBed.configureTestingModule({
      declarations: [ MessagesComponent ],
      providers: [{ provide: 'IDisplayMessages', useValue: spyIDisplayMessages }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask messages deletion', waitForAsync(() => {
    let clearButton = fixture.debugElement.nativeElement.querySelector('.clear');
    clearButton.click();

    fixture.whenStable().then(() => {
      expect(spyIDisplayMessages.askMessagesClear).toHaveBeenCalledOnceWith();
    });
  }));
});
