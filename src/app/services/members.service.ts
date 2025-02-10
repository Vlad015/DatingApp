import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http= inject(HttpClient)
  baseUrl='https://localhost:7263/api/';
  
  getMembers(){
    return this.http.get<Member[]>(this.baseUrl +'User');
  }

  getMember(username:string):Observable<Member>{
    return this.http.get<Member>(`${this.baseUrl}User/${username}`);
  }

}
