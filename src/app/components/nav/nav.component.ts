import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  authService=inject(AuthService);
  model:any={};
  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe({
      next:response=>{
        console.log(response);
      },
      error:error=>console.log(error)
    })
  }
  logout(){
    console.log("user has been logged out");
    this.authService.logout();
    
  }
}
