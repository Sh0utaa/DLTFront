import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  form = {
    username: '',
    email: '',
    birthdate: '',
    password: ''
  };

  showPassword = false

  // Allow only numbers and control keys
  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Auto-format with slashes
  formatDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits
    
    // Auto-insert slashes
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    this.form.birthdate = value.substring(0, 10); // Limit to DD/MM/YYYY format
    input.value = this.form.birthdate;
  }

  onSubmit() {
    // Validate date format before submission
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this.form.birthdate)) {
      alert('Please enter a valid date (DD/MM/YYYY)');
      return;
    }
    console.log('Register form data:', this.form);
  }
}
