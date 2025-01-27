import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  authService=inject(AuthService);
  router=inject(Router)
  model:any={};
  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe({
      next:_=>{
        void this.router.navigateByUrl('/members')
      },
      error:error=>console.log(error)
    })
  }
  logout(){
    console.log("user has been logged out");
    this.authService.logout();
    this.router.navigateByUrl('/');
    
  }
}
