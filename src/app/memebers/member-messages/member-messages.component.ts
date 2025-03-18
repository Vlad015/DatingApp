import { Component, inject, input, output, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { MessageService } from '../../services/message.service.service';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule,CommonModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent  {
  @ViewChild('messageForm') messageForm?:NgForm;
  private messageService=inject(MessageService);
  username = input.required<string>();
  messages = input.required<Message[]>();
  messageContent='';
  updateMessages=output<Message>();

  sendMessage(){
    this.messageService.sendMessage(this.username(),this.messageContent).subscribe({
      next:message=>{
        this.updateMessages.emit(message);
        this.messageForm?.reset();
      }
    })
  }
}
