import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  step: 'form' | 'verify' | 'done' = 'form';


  form = {
    username: '',
    email: '',
    birthdate: '',
    password: ''
  };

  verificationCode = "";

  constructor(private http: HttpClient) {}

  goToVerificationStep() {
    if (!this.form.email)
    {
      alert("Email is required");
      return;
    }

    this.http.post('https://dlt-api.shotatevdorashvili.com/api/email/send-verification-code', {
      email: this.form.email
    }).subscribe({
      next: () => {
        this.step = 'verify';
      },
      error: err => {
        alert('Failed to send verification code');
        console.error(err);
      }
    });
  }

  verifyCode() {
    if(!this.verificationCode)
    {
      alert("Enter the verification code")
      return;
    }

    this.http.post('https://dlt-api.shotatevdorashvili.com/api/email/verify-code', {
      email: this.form.email,
      code: this.verificationCode
    }).subscribe({
      next: () => {
        this.registerUser();
      },
      error: err => {
        alert('Verification failed');
        console.error(err);
      }
    });
  }
  
  registerUser() {
    this.http.post('https://dlt-api.shotatevdorashvili.com/api/auth/register', this.form)
      .subscribe({
        next: () => {
          this.step = 'done';
          alert('Registration successful!');
        },
        error: err => {
          alert('Registration failed');
          console.error(err);
        }
      });
  }
}
