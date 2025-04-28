import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  registerMode=false;
  
  registerToggle(){
    this.registerMode=!this.registerMode;
  }
  cancelRegisterMode(event:boolean){
    this.registerMode=event;
  }
  
}
