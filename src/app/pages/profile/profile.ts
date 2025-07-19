import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  email: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  isLoading = true;
  errorMessage = '';
  userData: User | null = null;
  stars = Array(5).fill(0);

  constructor(
    private authService: AuthService, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.validateUser();
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.getUserData().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (user) => {
        this.userData = user;
        console.log("User data loaded:", user);
      },
      error: (err) => {
        console.error("Failed to load user data:", err);
        this.errorMessage = "Failed to load profile data";
      }
    });
  }

  getUserData(): Observable<User | null> {
    return this.http.get<User>(
      `${environment.apiUrl}/api/auth/get-current-user`,
      { withCredentials: true }
    ).pipe(
      catchError(err => {
        console.error('Failed to fetch user data:', err);
        this.errorMessage = 'Failed to load user profile';
        return of(null);
      })
    );
  }

  validateUser(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.validateUser()
      .pipe(
        catchError((err) => {
          console.error('Authentication error:', err);
          this.errorMessage = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            console.log("User authenticated successfully");
          }
        }
      });
  }

  logout(): void {
    this.isLoading = true;
    this.authService.logout()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Logout error:', err);
          this.errorMessage = 'Failed to logout. Please try again.';
        }
      });
  }
}