import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private toastr=inject(ToastrService)
  private authService=inject(AuthService)
  email='';
  username='';
  SendResetLink(){
    this.authService.forgotPassword(this.email).subscribe({
      next:()=>{
        this.toastr.success("Link has been sent to your email!", "info",)
      }
      
    })
  }
}
