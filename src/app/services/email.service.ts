import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly API_URL = 'https://dlt-api.shotatevdorashvili.com/api/email';

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/send-verification-code`, { email }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }
  sendPasswordResetCode(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/send-password-reset-code`, email);
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-code`, { email, code }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }

  verifyPasswordResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-password-reset-code`, { email, code });
  }
}
