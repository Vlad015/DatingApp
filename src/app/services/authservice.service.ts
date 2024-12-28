import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private http = inject(HttpClient);
  baseUrl="https://localhost:7263/api/Account/"
  constructor() { }

  login(model:any){
    return this.http.post(this.baseUrl+'login',model)
  }
}
