import { AfterViewChecked, AfterViewInit, Component, effect, ElementRef, inject, input, ViewChild } from '@angular/core';
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
export class MemberMessagesComponent implements AfterViewInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messageService = inject(MessageService);
  username = input.required<string>();
  messageContent = '';
  messages: Message[] = [];

  constructor() {
    effect(() => {
      this.messages = this.messageService.messageThread();
  
      
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }
  

  get usernameValue(): string {
    return this.username(); 
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
  isRead(dateRead: Date | undefined): boolean {
    return !!dateRead;
  }
  ngAfterViewInit(): void {
    effect(() => {
      this.messageService.messageThread();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }
  getTimeOnly(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // set to true if you want AM/PM format
    });
  }
  getMessageHeader(date: Date | string): string {
    const messageDate = new Date(date);
    const now = new Date();
  
    const isToday = messageDate.toDateString() === now.toDateString();
  
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
  
    return messageDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  groupMessagesByDay(messages: Message[]) {
    const grouped: { date: string; messages: Message[] }[] = [];
  
    for (const msg of messages) {
      const label = this.getMessageHeader(msg.messageSent);
      const existing = grouped.find(g => g.date === label);
      if (existing) {
        existing.messages.push(msg);
      } else {
        grouped.push({ date: label, messages: [msg] });
      }
    }
  
    return grouped;
  }
  
  scrollToBottom(): void {
    const el = this.messageContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
  
}
