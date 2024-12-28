import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./components/nav/nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected typo here
})
export class AppComponent implements OnInit{
  title = 'DatingApp';
  users:any;
  constructor( private http: HttpClient){
   
  }

  ngOnInit(): void {
    this.http.get('https://localhost:7263/api/User').subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.error('Error fetching users:', error),
      complete: () => console.log('Fetch users completed'),
    });
  }
}
