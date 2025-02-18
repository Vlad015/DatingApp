import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { DatePickerComponent } from "../../_forms/date-picker/date-picker.component";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private authService=inject(AuthService);
  private fb=inject(FormBuilder)
  private toastr=inject(ToastrService);
  cancelRegister=output<boolean>()
  model:any={}
 registerForm:FormGroup=new FormGroup({});
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(){
    this.registerForm=this.fb.group({
      gender:['male'],
      username: ['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword:['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: ()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })

  }
  matchValues(matchTo :string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control.value===control.parent?.get(matchTo)?.value? null:{isMatching:true}
    }
  }

  register(){
    console.log(this.registerForm.value);
    // this.authService.register(this.model).subscribe({
    //   next: response=>{
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error=>{this.toastr.error(error.error)}
    // })
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
