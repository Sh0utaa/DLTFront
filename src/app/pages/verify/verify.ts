import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './verify.html'
})
export class Verify {
  email = '';
  mode = '';
  formData: any;

  code: string[] = ['', '', '', '', '', ''];

  constructor(
    private location: Location,
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

    if (state) {
      this.email = state.formData.email;
      this.formData = state.formData;
      this.mode = state.mode;
    }
  } 

  ngOnInit() {
    if(this.mode !== 'register' && this.mode !== 'forgot-password')
    {
      this.router.navigate(['/exam']);
    }

    if(this.mode === 'register')
    {
      console.log("sending verification code to: ", this.email);
      this.emailService.sendVerificationCode(this.email);
    } 
    else {
      console.log("sending password reset code to: ", this.email);
      this.emailService.sendPasswordResetCode(this.email);
      return;
    }
  }

  goBack(): void {
    this.location.back();
  }

  verifyCode() {
    const fullCode = this.code.join('');
    if (fullCode.length !== 6) {
      alert('Please enter the full 6-digit code.');
      return;
    }

    console.log('Verifying code:', fullCode);

    if (this.mode === 'register') {
      this.emailService.verifyCode(this.email, fullCode).subscribe({
        next: (success) => {
          if (!success) {
            alert("Invalid code");
            return;
          }
          this.authService.register(this.formData).subscribe({
            next: (response) => {
              // Handle successful registration
              console.log('Registration successful', response);
            },
            error: (err) => {
              console.error('Registration failed', err);
              alert("Registration failed");
            }
          });
        },
        error: (err) => {
          console.error('Verification failed', err);
          alert("Verification failed");
        }
      });
    } 
    else if (this.mode === 'forgot-password') {
      this.emailService.verifyPasswordResetCode(this.email, fullCode).subscribe({
        next: (success) => {
          if (!success) {
            alert("Invalid code");
            return;
          }
          // Handle successful password reset verification
        },
        error: (err) => {
          console.error('Password reset verification failed', err);
          alert("Verification failed");
        }
      });
    } else {
      alert('Please enter the full 6-digit code.');
    }
  }
}
