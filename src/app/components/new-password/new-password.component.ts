import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule, RouterModule,CommonModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router=inject(Router);

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
    });
  }
  isSubmitting = false;

  get passwordsDoNotMatch(): boolean {
    return this.newPassword !== this.confirmPassword;
  }

  resetPassword() {
    if (this.isSubmitting) return; 
    this.isSubmitting = true;

    if (!this.newPassword || !this.confirmPassword) {
      console.error('Please fill all fields.');
      this.isSubmitting = false;
      return;
    }

    if (this.passwordsDoNotMatch) {
      console.error('Passwords do not match.');
      this.isSubmitting = false;
      return;
    }

    // Optional: Check password strength (length, uppercase, lowercase, number)
    if (!this.isPasswordValid(this.newPassword)) {
      console.error('Password does not meet the required conditions.');
      this.isSubmitting = false;
      return;
    }

    this.authService.resetPassword(this.email, this.token, this.newPassword).subscribe({
      next: () => {
        console.log('Password reset successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
        this.isSubmitting = false;
      }
    });
  }

  isPasswordValid(password: string): boolean {
    const minLength = 6;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    return password.length >= minLength && hasNumber && hasUpper && hasLower;
  }
  
}
