import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  showPassword = false

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('https://dlt-api.shotatevdorashvili.com/auth/login', this.form)
      .subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Login failed. Please check your credentials.');
        }
      });
  }
}

interface LoginForm {
  email: string;
  password: string;
}
