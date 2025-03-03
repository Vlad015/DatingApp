import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal, WritableSignal } from '@angular/core';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AuthService } from './auth.service';
import { setPaginatedResponse, setPaginationHeaders } from './paginationhelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http= inject(HttpClient);
  private authService=inject(AuthService);
  baseUrl='https://localhost:7263/api/';
  paginatedResult: WritableSignal<PaginatedResult<Member[]> | null> = signal(null);

  memberCache=new Map();
  user=this.authService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }
  
  getMembers() {
    const cacheKey = Object.values(this.userParams()).join('-');
    const response = this.memberCache.get(cacheKey);

    if (response) {
        setPaginatedResponse(response, this.paginatedResult);
        return;
    }

    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Member[]>(this.baseUrl + 'User', { observe: 'response', params }).subscribe({
        next: response => {
            setPaginatedResponse(response, this.paginatedResult);
            this.memberCache.set(cacheKey, response);
        },
        error: err => console.error('Error fetching members:', err)
    });
}



  getMember(username: string) {
    console.log('Checking member cache:', this.memberCache);
  
    // Flatten all stored member lists and find the member
    const allMembers = [...this.memberCache.values()]
      .flatMap((response: Member[]) => response);
  
    console.log('All members:', allMembers);
  
    const member = allMembers.find((m: Member) => m.username === username);
  
    console.log('Found member:', member);
  
    if (member) {
      return of(member); // Return cached data as an Observable
    }
  
    console.log('Fetching member from API:', username);
    return this.http.get<Member>(`${this.baseUrl}User/${username}`);
  }
  
  
  updateMember(member:Member){
    return this.http.put<Member>(this.baseUrl+'User', member).pipe(
      // tap(() =>{
      //   this.members.update(members => members.map(m=>m.username===member.username ? member :m))
      // })
    )
  }
  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'User/set-main-photo/' + photo.id, {}).pipe(
      // tap(() => {
      //   this.members.update(members =>
      //     members.map((m: Member) => {
      //       if (m.photos.includes(photo)) {
      //         m.photoUrl = photo.url;
      //       }
      //       return m;
      //     })
      //   );
      // })
    );
  }

  deletePhoto(photo:Photo){
    return this.http.delete(this.baseUrl+'User/delete-photo/' +photo.id).pipe(
     
     
      // tap(()=>{
      //   this.members.update(members=>members.map(m=>{
      //     if(m.photos.includes(photo)){
      //       m.photos=m.photos.filter(x=>x.id===photo.id)
      //     }
      //     return m
      //   }))
      // }));
  )}
}
