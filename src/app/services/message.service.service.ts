import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationhelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
 baseUrl:string='https://localhost:7263/api/Messages';
 private http=inject(HttpClient);
 hubUrl='https://localhost:7263/hubs/';
 hubConnection?:HubConnection;
 messageThread=signal<Message[]>([]);
  
  createHubConnection(user:User, otherUsername:string){
    this.hubConnection=new HubConnectionBuilder().withUrl(this.hubUrl+'message?user='+otherUsername,{
      accessTokenFactory:()=>user.token
    })
    .withAutomaticReconnect()
    .build();
    this.hubConnection.start().catch(error=>console.log(error))
    this.hubConnection.on('ReceiveMessageThread', messages=>{
      this.messageThread.set(messages)
    });
    this.hubConnection.on('NewMessage', message=>{
      this.messageThread.update(messages=>[...messages, message])
    })
    this.hubConnection.on('UpdatedGroup', (group:Group)=>{
      if(group.connections.some(x=>x.username=== otherUsername)){
        this.messageThread.update(message =>{
          return message.map(message=>{
            if(!message.dateRead){
              return {...message, dateRead:new Date()};
            }
              return message;
          })
        })
      }
    })
  }
  stopHubConnection(){
    if(this.hubConnection?.state=== HubConnectionState.Connected){
      this.hubConnection.stop().catch(error=>console.log(error));
    }
  }

  paginatedResult=signal<PaginatedResult<Message[]> | null>(null);
  
  getMessages(pageNumber:number, pageSize:number, container:string){
    let params=setPaginationHeaders(pageNumber,pageSize);
    params=params.append('Container', container);
    return this.http.get<Message[]>(this.baseUrl, {observe:'response', params})
    .subscribe({
      next:response=> setPaginatedResponse(response, this.paginatedResult)
    })
  }

  getMessageThread(username:string){
    console.log(this.baseUrl +'/thread/'+username);
    return this.http.get<Message[]>(this.baseUrl +'/thread/'+username);
    
  }
  sendMessage(username:string, content:string){
    return this.hubConnection?.invoke('SendMessage',{recipientUsername:username, content})
  }
  deleteMessage(id:number){
    return this.http.delete(this.baseUrl+ '/' +id);
  }
}
