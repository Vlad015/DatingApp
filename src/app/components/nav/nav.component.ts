import { Component, inject, OnInit,HostListener } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive,HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  authService=inject(AuthService);
   private router=inject(Router)
   private toastr=inject(ToastrService)
   isScrolled = false;

   @HostListener('window:scroll', [])
   onWindowScroll() {
     this.isScrolled = window.scrollY > 10;
   }
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
