import { Component, inject, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgIf, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive,TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  authService=inject(AuthService);
   private router=inject(Router)
   private toastr=inject(ToastrService)
  model:any={};
  ngOnInit() {
    console.log(this.authService.currentUser()?.photoUrl+" User ul curent")
            
  }
  
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
