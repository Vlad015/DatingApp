import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  baseUrl="https://localhost:7263";
  private http= inject(HttpClient);
  validationErrors:string[]=[];
  checkButton:boolean=false;

  get400Error(){
    this.http.get(this.baseUrl+ '/bad-request').subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error)
    })
  }
  get401Error(){
    this.http.get(this.baseUrl+ '/auth').subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error)
    })
  }
  get404Error(){
    this.checkButton=true;
    this.http.get(this.baseUrl+ '/not-found').subscribe({
      next: response=> console.log(response),
      error: error=> {
        console.log(error);
      }
    })
  }
  get500Error(){
    this.http.get(this.baseUrl+ '/server-error').subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error)
    })
  }
  get400ValidationError(){
    this.http.post(this.baseUrl+ '/api/Account/register', {}).subscribe({
      next: response=> console.log(response),
      error: error => {
        console.log(error);
        this.validationErrors = error;
      }
    })
  }
}
