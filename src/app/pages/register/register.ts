import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  form = {
    username: '',
    email: '',
    birthdate: '',
    password: ''
  };

  @Output() emailSubmitted = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  onSubmit() {
    const { username, email, birthdate, password } = this.form;

    if (!username || !email || !birthdate || !password) {
      alert("All fields are required");
      return;
    }
  }
}
