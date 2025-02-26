import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http= inject(HttpClient);
  private authService=inject(AuthService);
  baseUrl='https://localhost:7263/api/';
  paginatedResult=signal<PaginatedResult<Member[]> |null>(null)
  memberCache=new Map();
  user=this.authService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }
  
  getMembers(): void {
  const cacheKey = Object.values(this.userParams()).join('-');
  const cachedMembers = this.memberCache.get(cacheKey);

  if (cachedMembers) {
    console.log('Using cached members:', cachedMembers);
    this.paginatedResult.set({ items: cachedMembers, pagination: this.paginatedResult()?.pagination });
    return;
  }

  let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
  params = params.append('minAge', this.userParams().minAge);
  params = params.append('maxAge', this.userParams().maxAge);
  params = params.append('gender', this.userParams().gender);
  params = params.append('orderBy', this.userParams().orderBy);

  this.http.get<Member[]>(this.baseUrl + 'User', { observe: 'response', params }).subscribe({
    next: response => {
      console.log('API Response:', response.body);
      const members = response.body as Member[];
      const pagination = JSON.parse(response.headers.get('Pagination')!);
      this.paginatedResult.set({ items: members, pagination });

      this.memberCache.set(cacheKey, members);
    },
    error: err => console.error('Error fetching members:', err)
  });
}

  private setPaginatedResponse(response:HttpResponse<Member[]>){
    this.paginatedResult.set({
      items:response.body as Member[],
      pagination:JSON.parse(response.headers.get('Pagination')!)
    })
  }
  private setPaginationHeaders(pageNumber:number, pageSize:number){
    let params=new HttpParams();
    if(pageNumber && pageSize){
      params=params.append('pageNumber',pageNumber);
      params=params.append('pageSize',pageSize);
    }
    return params;
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
