import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface LoginForm {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './login.html',
})
export class Login {
  form: LoginForm = {
    email: '',
    password: ''
  };

  showPassword = false;
  statusMessage: string | null = null;
  statusType: 'success' | 'error' | null = null;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

    ngOnInit() {
    this.http.get<{ message: string }>('https://dlt-api.shotatevdorashvili.com/api/auth/validate-user', {
      withCredentials: true,
      headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
      }
    }).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/profile');
      },
      error: (err) => {
        console.log('Not authenticated:', err);
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.statusMessage = null;
    this.statusType = null;

    this.http.post<any>('https://dlt-api.shotatevdorashvili.com/api/auth/login', this.form, {
    // this.http.post<any>('http://localhost:5279/api/auth/login', this.form, {
      withCredentials: true, 
      observe: 'response' 
    })
    .subscribe({
      next: (response) => {
        // Check if status is in 200-299 range
        if (response.status >= 200 && response.status < 300) {
          this.statusMessage = 'Sign in successful!';
          this.statusType = 'success';
          setTimeout(() => this.router.navigateByUrl('/exam'), 1000);
        } else {
          // Handle other successful status codes if needed
          this.handleError(response);
        }
      },
      error: (err) => {
        this.handleError(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any) {
    this.isLoading = false;
    if (error.status === 401) {
      this.statusMessage = 'Invalid email or password.';
    } else {
      this.statusMessage = error?.error?.message || 'Something went wrong.';
    }
    this.statusType = 'error';
  }
}
