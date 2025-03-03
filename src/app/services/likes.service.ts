import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationhelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  baseUrl='https://localhost:7263/api/Likes/'
  private http=inject(HttpClient);
  likeIds=signal<number[]>([]);
  paginatedResult=signal<PaginatedResult<Member[]> |null>(null)

  toggleLike(targetId:number){
    return this.http.post(`${this.baseUrl}${targetId}`, {})
  }
  getLikes(predicate:string, pageNumber:number, pageSize:number ){
    let params=setPaginationHeaders(pageNumber,pageSize);

    params=params.append('predicate', predicate);
    return this.http.get<Member[]>(`${this.baseUrl}`,
      {observe:'response',params}).subscribe({
        next:response=>setPaginatedResponse(response,this.paginatedResult)
      })
  }
  getLikesIds(){
    return this.http.get<number[]>(`${this.baseUrl}list`).subscribe({
      next: ids=>this.likeIds.set(ids)
    })
  }
}
