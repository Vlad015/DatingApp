import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationhelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
baseUrl:string='https://localhost:7263/api/Messages'
private http=inject(HttpClient);
  constructor() { }

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
    return this.http.post<Message>(this.baseUrl, {recipientUsername: username, content})
  }
  deleteMessage(id:number){
    return this.http.delete(this.baseUrl+ '/' +id);
  }
}
