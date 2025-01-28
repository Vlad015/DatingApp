import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, RouterLinkActive,TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  authService=inject(AuthService);
   private router=inject(Router)
   private toastr=inject(ToastrService)
  model:any={};
  login(){
    console.log(this.model);
    this.authService.login(this.model).subscribe({
      next:_=>{
        void this.router.navigateByUrl('/members')
      },
      error: error => this.toastr.error(error.error)
    })
  }
  logout(){
    console.log("user has been logged out");
    this.authService.logout();
    this.router.navigateByUrl('/');
    
  }
}
