import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  statusMessage = ''
  statusType: 'success' | 'error' | null = null;

  form = {
    "email": "",
    "password": "",
    "confirmPassword": ""
  }
  passwordErrors: string[] = [];
  showPasswordErrors = false;

  constructor(private emailService: EmailService, private router: Router) {}

  validatePassword(): boolean {
    this.passwordErrors = [];
    
    if (this.form.password.length < 8) {
      this.passwordErrors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(this.form.password)) {
      this.passwordErrors.push('At least one uppercase letter (A-Z)');
    }
    if (!/[a-z]/.test(this.form.password)) {
      this.passwordErrors.push('At least one lowercase letter (a-z)');
    }
    if (!/[0-9]/.test(this.form.password)) {
      this.passwordErrors.push('At least one number (0-9)');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.form.password)) {
      this.passwordErrors.push('At least one special character (!@#$...)');
    }
    console.log(this.passwordErrors)
    return this.passwordErrors.length === 0;
  }

  onSubmit()
  {
    if(!this.form.email)
    {
      this.statusMessage = "Please provide an Email"
      this.statusType = 'error'
      return;
    }

    if (!this.validatePassword()) {
      this.showPasswordErrors = true;
      this.statusMessage = 'Please fix password requirements';
      this.statusType = 'error';
      return;
    }

   try {
      this.emailService.sendPasswordResetCode(this.form.email).subscribe({
        next: (response: string) => {
          console.log('Response:', response); // This will be the text message
          this.router.navigate(['/verify'], {
            state: {
              formData: this.form,
              mode: 'forgot-password'
            }
          });
        },
        error: (err) => {
          this.statusMessage = err.error?.message || 'Failed to send verification code. Please try again.';
          this.statusType = 'error';
          console.error('Failed to send verification code:', err);
        }
      });
    } catch (error) {
      this.statusMessage = 'Failed to send verification code. Please try again.';
      this.statusType = 'error';
      console.error('Failed to send verification code:', error);
    } 
  }
}
