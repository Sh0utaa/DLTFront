import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://dlt-api.shotatevdorashvili.com/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  // Login with email and password
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password }, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      })
    );
  }

  // Validate user session
  validateUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/validate-user`, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  // Check authentication status
  private checkAuthStatus(): void {
    this.validateUser().subscribe({
      next: () => this.isAuthenticatedSubject.next(true),
      error: () => this.isAuthenticatedSubject.next(false)
    });
  }

  // Get current authentication status
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Get authentication status synchronously
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}