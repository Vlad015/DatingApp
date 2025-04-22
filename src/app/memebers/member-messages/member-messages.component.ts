import { Component, effect, inject, input, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service.service';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Message } from '../../_models/message';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, CommonModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  messageService = inject(MessageService);
  username = input.required<string>();
  messageContent = '';
  messages: Message[] = [];

constructor() {
  effect(() => {
    this.messages = this.messageService.messageThread(); // bind signal
    console.log('🔁 Updated messages:', this.messages);
  });
}

  get usernameValue(): string {
    return this.username(); // for use in template
  }

  sendMessage() {
    this.messageService.sendMessage(this.username(), this.messageContent)
      ?.then(() => {
        this.messageForm?.reset();
      })
      .catch(err => console.error('❌ Failed to send message:', err));
  }

  isReadNow(dateRead: Date | undefined): boolean {
    if (!dateRead) return false;
    const now = new Date().getTime();
    const readTime = new Date(dateRead).getTime();
    return (now - readTime) <= 60 * 1000;
  }
}
