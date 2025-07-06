import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmailService } from '../../services/email.service';

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

  showPassword = false;
  showPasswordErrors = false;
  passwordErrors: string[] = [];
  statusMessage = '';
  statusType: 'success' | 'error' | null = null;

  constructor(private router: Router, private emailService: EmailService) {};

  isFormComplete(): boolean {
    return Object.values(this.form).every(value => value.trim() !== '');
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  formatDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    this.form.birthdate = value.substring(0, 10);
    input.value = this.form.birthdate;
  }

  validatePassword(): boolean {
    this.passwordErrors = [];
    
    if (this.form.password.length < 8) {
      this.passwordErrors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(this.form.password)) {
      this.passwordErrors.push('At least one uppercase letter (A-Z)');
    }
    if (!/[a-z]/.test(this.form.password)) {
      this.passwordErrors.push('At least one lowercase letter (a-z)');
    }
    if (!/[0-9]/.test(this.form.password)) {
      this.passwordErrors.push('At least one number (0-9)');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.form.password)) {
      this.passwordErrors.push('At least one special character (!@#$...)');
    }

    return this.passwordErrors.length === 0;
  }

 validateBirthdate(): boolean {
    // Check format first
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this.form.birthdate)) {
      return false;
    }
    
    const [day, month, year] = this.form.birthdate.split('/').map(Number);
    
    // Basic range checks
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Check for valid year (adjust range as needed)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) return false;
    
    // Check for months with 30 days
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    
    // February check (including leap years)
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (day > (isLeapYear ? 29 : 28)) return false;
    }
    
    // Final date object validation
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  } 

  async onSubmit() {
    this.showPasswordErrors = false;
    this.statusMessage = '';
    this.statusType = null;

    // Validate birthdate first
    if (!this.validateBirthdate()) {
      this.statusMessage = 'Please enter a valid date (DD/MM/YYYY)';
      this.statusType = 'error';
      return;
    }

    // Validate password only when submitting
    if (!this.validatePassword()) {
      this.showPasswordErrors = true;
      this.statusMessage = 'Please fix password requirements';
      this.statusType = 'error';
      return;
    }

    // If validations pass, proceed with verification code
    try {
      this.emailService.sendVerificationCode(this.form.email).subscribe({
        next: (response) => {
          this.router.navigate(['/verify'], {
            state: {
              formData: this.form,
              mode: 'register'
            }
          });
        },
        error: (err) => {
          this.statusMessage = 'Failed to send verification code. Please try again.';
          this.statusType = 'error';
          console.error('Failed to send verification code:', err);
        }
      });
    } catch (error) {
      this.statusMessage = 'An unexpected error occurred.';
      this.statusType = 'error';
      console.error('Error:', error);
    }
  } 
}
