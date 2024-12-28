import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private accountService=inject(AuthserviceService);
  loggedIn=false;
  model:any={};
  login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next:response=>{
        console.log(response);
        this.loggedIn=true;
      },
      error:error=>console.log(error)
    })
  }
  logout(){
    console.log("user has been logged out");
    this.loggedIn=false;
  }
}
