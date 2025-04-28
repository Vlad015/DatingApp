import { HttpClient } from '@angular/common/http';
import { Injectable,computed,inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private likeService=inject(LikesService);
  private presenceService=inject(PresenceService);
  baseUrl=environment.apiUrl;
  currentUser=signal<User | null>(null);
  roles=computed(()=>{
    const user=this.currentUser();
    if(user&&user.token){
      const role= JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role)? role: [role];
    }
    return [];
  })
  constructor() { }

  login(model:any){
    return this.http.post<User>(this.baseUrl+'login',model).pipe(
      map(user=>{
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }
  register(model:any){
    return this.http.post<User>(this.baseUrl+'register',model).pipe(
      map(user=>{
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }
  
  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
  forgotPassword(email:string){
    return this.http.post(this.baseUrl+'forgot-password',{email})
  }

  resetPassword(email:string, token:string, newPassword:string){
    return this.http.post<{ message: string }>(this.baseUrl+'reset-password',{
      email,
      token,
      newPassword
    }
    );
  }

  setCurrentUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikesIds();
    this.presenceService.createHubConnection(user);
  }
}
