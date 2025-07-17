import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.html'
})
export class Verify {
  email = '';
  mode = '';
  formData: any;
  isLoading = false;
  statusMessage = '';
  statusType: 'success' | 'error' | null = null;
  fullCode = '';
  code: string[] = ['', '', '', '', '', ''];

  constructor(
    private location: Location,
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

    if (state) {
      this.email = state.formData.email;
      this.formData = state.formData;
      this.mode = state.mode;
    }
  } 

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit() {
    if(this.mode !== 'register' && this.mode !== 'forgot-password')
    {
      this.router.navigate(['/exam']);
    }

    if(this.mode === 'register')
    {
      this.emailService.sendVerificationCode(this.email);
    } 
    else {
      this.emailService.sendPasswordResetCode(this.email);
      return;
    }
  }

  goBack(): void {
    this.location.back();
  }

  onKeyDown(event: KeyboardEvent) {
    // Allow only numbers, backspace, and navigation keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text').trim() || '';
    const numbersOnly = pasteData.replace(/\D/g, '').substring(0, 6);
    this.fullCode = numbersOnly;
  }

  verifyCode() {
    if (this.fullCode.length !== 6) {
      this.statusMessage = "Please enter the full 6-digit code";
      this.statusType = 'error';
      return;
    }

    if (this.mode === 'register') {
      this.emailService.verifyCode(this.email, this.fullCode).subscribe({
        next: (success) => {
          if (!success) {
            this.statusMessage = "Invalid code";
            this.statusType = 'error';
            return;
          }
          this.authService.register(this.formData).subscribe({
            next: (response) => {
              // Handle successful registration
              console.log('Registration successful', response);

              this.authService.login(this.formData.email, this.formData.password).subscribe({
                next: (loginResponse) => {
                  // Navigate to profile after successful login
                  this.router.navigate(['/profile']);
                },
                error: (loginError) => {
                  console.error('Auto-login failed', loginError);
                  // Even if auto-login fails, registration was successful
                  this.router.navigate(['/login'], {
                    queryParams: { registered: 'true' }
                  });
                }
              });

            },
            error: (err) => {
              console.error('Verification failed', err);
              this.statusMessage = "Verification failed";
              this.statusType = 'error';
            }
          });
        },
        error: (err) => {
          console.error('Verification failed', err);
          this.statusMessage = "Verification failed";
          this.statusType = 'error';
        }
      });
    } 
    else if (this.mode === 'forgot-password') {
      this.emailService.verifyPasswordResetCode(this.email, this.fullCode).subscribe({
        next: (success) => {
          if (!success) {
            this.statusMessage = "Invalid code";
            this.statusType = 'error';
            return;
          }
          // Call the /api/auth/reset-password route
          let resetPasswordObject = {
            "email": this.formData.email,
            "code": this.fullCode,
            "newPassword": this.formData.password
          }
          this.isLoading = true;
          this.http.post("http://localhost:5279/api/auth/reset-password", resetPasswordObject)
          .subscribe({
            next: (resetResponse) => {
              this.statusMessage = "Password reset successfully"
              this.statusType = "success"
              this.router.navigate(['/login']);
            },
            error: (resetError) => {
              console.error('Password reset failed:', resetError);
              this.statusMessage = `Password reset failed: ${resetError.error?.message || 'Please try again'}`
              this.statusType = "success"
            }
          })
        },
        error: (err) => {
          console.error('Password reset verification failed', err);
          this.statusMessage = "Verification failed";
          this.statusType = 'error';
        }
      });
    } else {
      this.statusMessage = "Please enter the full 6-digit code.";
      this.statusType = 'error';
    }
  }
}
