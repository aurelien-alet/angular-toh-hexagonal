import { Component, Inject, OnInit } from '@angular/core';
import IDisplayMessages from 'src/app/domain/ports/i-display-messages';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  
  constructor(
    @Inject('IDisplayMessages') public messagesDisplayer: IDisplayMessages
  ) {}

  ngOnInit() {}

}
