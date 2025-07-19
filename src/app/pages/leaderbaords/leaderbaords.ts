import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-leaderbaords',
  imports: [CommonModule],
  templateUrl: './leaderbaords.html',
  styleUrl: './leaderbaords.css'
})
export class Leaderbaords {
  private url = `${environment.apiUrl}/api/leaderboards/rates`

  leaderboardData: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private http: HttpClient){}

  ngOnInit() {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.isLoading = true;
    this.getLeaderboards().subscribe({
      next: (data) => {
        this.leaderboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load leaderboard data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getLeaderboards() {
    return this.http.get<any[]>(this.url, { withCredentials: true});
  }
}
