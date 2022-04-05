import { Inject, Injectable } from "@angular/core";
import IDisplayMessages from "./ports/i-display-messages";
import IManageMessages from "./ports/i-manage-messages";

@Injectable()
export default class MessagesDisplayer implements IDisplayMessages {
    
    messages: string[] = [];

    constructor(
        @Inject('IManageMessages') private _messagesManager: IManageMessages,
    ) {
        this.messages = _messagesManager.messages;
    }
    
    askMessagesClear(): void {
        this._messagesManager.clear();
        this.messages = this._messagesManager.messages;
    }
    
}