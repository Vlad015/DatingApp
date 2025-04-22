import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/nav/nav.component";
import { AuthService } from './services/auth.service';
import { HomeComponent } from "./components/home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected typo here
})
export class AppComponent implements OnInit{
  private authService=inject(AuthService);
  private presenceService=inject(PresenceService);
  backgroundUrl = 'url(assets/images/bg.avif)'
  constructor(){
   
  }

  ngOnInit(): void {
    this.setCurrentUser();
    console.log('Current User:', this.authService.currentUser()?.photoUrl);
    const user = this.authService.currentUser();
    
  if (user) {
    this.presenceService.createHubConnection(user);
  }
  }
  setCurrentUser(){
    const userString=localStorage.getItem('user');
    if(!userString) return;
    const user=JSON.parse(userString);
    this.authService.setCurrentUser(user);
  }
  
}
