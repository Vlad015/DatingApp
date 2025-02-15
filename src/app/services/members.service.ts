import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Member } from '../_models/member';
import { Observable, of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http= inject(HttpClient)
  baseUrl='https://localhost:7263/api/';
  members=signal<Member[]>([]);
  
  getMembers(){
    return this.http.get<Member[]>(this.baseUrl +'User').subscribe({
      next: members=> this.members.set(members)
    });

  }

  getMember(username:string):Observable<Member>{
    const member=this.members().find(x=>x.username===username);
    if(member!==undefined) return of (member);
    return this.http.get<Member>(`${this.baseUrl}User/${username}`);
  }
  updateMember(member:Member){
    return this.http.put<Member>(this.baseUrl+'User', member).pipe(
      tap(() =>{
        this.members.update(members => members.map(m=>m.username===member.username ? member :m))
      })
    )
  }
  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'User/set-main-photo/' + photo.id, {}).pipe(
      tap(() => {
        this.members.update(members =>
          members.map((m: Member) => {
            if (m.photos.includes(photo)) {
              m.photoUrl = photo.url;
            }
            return m;
          })
        );
      })
    );
  }

  deletePhoto(photo:Photo){
    return this.http.delete(this.baseUrl+'User/delete-photo/' +photo.id).pipe(
      tap(()=>{
        this.members.update(members=>members.map(m=>{
          if(m.photos.includes(photo)){
            m.photos=m.photos.filter(x=>x.id===photo.id)
          }
          return m
        }))
      }));
  }
}
