import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  isLoading = true;
  errorMessage = '';
  userData: any;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.validateUser();
  }

  validateUser() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.validateUser()
      .pipe(
        catchError((err) => {
          console.error('Authentication error:', err);
          this.errorMessage = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
          return of(null); // Return observable to prevent error propagation
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.userData = res;
            console.log("User authenticated successfully");
          }
        }
      });
  }

  logout() {
    this.isLoading = true;
    this.authService.logout()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          this.errorMessage = 'Failed to logout. Please try again.';
          // Force navigation even if logout API fails
          this.router.navigate(['/login']);
        }
      });
  }
}