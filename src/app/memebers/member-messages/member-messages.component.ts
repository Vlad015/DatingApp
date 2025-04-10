import { Component, inject, input, output, ViewChild } from '@angular/core';
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
  messageService=inject(MessageService);
  username = input.required<string>();
  messageContent='';

  sendMessage(){
    this.messageService.sendMessage(this.username(),this.messageContent)?.then(()=>{
      this.messageForm?.reset();
    })
  }
  isReadNow(dateRead: Date | undefined): boolean {
    if (!dateRead) return false;
    const now = new Date().getTime();
    const readTime = new Date(dateRead).getTime();
    return (now - readTime) <= 60 * 1000; 
  }
}
