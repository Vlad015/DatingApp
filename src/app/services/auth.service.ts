import { HttpClient } from '@angular/common/http';
import { Injectable,inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  baseUrl="https://localhost:7263/api/Account/";
  currentUser=signal<User| null>(null);
  constructor() { }

  login(model:any){
    return this.http.post<User>(this.baseUrl+'login',model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.post<User>(this.baseUrl+'register',model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    )
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
