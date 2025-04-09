import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl='https://localhost:7263/api/admin/';
  private http=inject(HttpClient)

  getUserWithRoles():Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl+'users-with-roles');
  }
  updateUserRoles(username:string, roles:string[]):Observable<string[]>{
    return this.http.post<string[]>(this.baseUrl+'edit-roles/'
      +username+ '?roles='+roles,{})
  }

}
