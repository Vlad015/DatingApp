import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/nav/nav.component";
import { AuthService } from './services/auth.service';
import { HomeComponent } from "./components/home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NavComponent, HomeComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected typo here
})
export class AppComponent implements OnInit{
  private authService=inject(AuthService)
  constructor(){
   
  }

  ngOnInit(): void {
    this.setCurrentUser();
    console.log('Current User:', this.authService.currentUser()?.photoUrl);
  }
  setCurrentUser(){
    const userString=localStorage.getItem('user');
    if(!userString) return;
    const user=JSON.parse(userString);
    this.authService.currentUser.set(user);
  }
  
}
