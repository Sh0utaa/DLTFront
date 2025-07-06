import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  constructor(private authService: AuthService, private router: Router) {};

  ngOnInit() {
    this.authService.validateUser()
    .subscribe({
        next: (res) => {
          console.log("User is authenticated")
        },
        error: (err) => {
          console.log("User not authenticated redirecting to login page.")
          this.router.navigateByUrl('/login');
        }
    });
  }

}
