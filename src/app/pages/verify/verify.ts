import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './verify.html'
})
export class Verify {
  code: string[] = ['', '', '', '', '', ''];

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    // Replace input and store value
    this.code[index] = value;
    input.value = value;

    if (value && index < this.code.length - 1) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="code${index + 1}"]`);
      nextInput?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Backspace behavior
    if (event.key === 'Backspace') {
      if (input.value === '' && index > 0) {
        const prevInput = document.querySelector<HTMLInputElement>(`input[name="code${index - 1}"]`);
        this.code[index - 1] = '';
        prevInput?.focus();
        event.preventDefault();
      }
    }

    // Left/Right arrow support
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`input[name="code${index - 1}"]`);
      prevInput?.focus();
    }

    if (event.key === 'ArrowRight' && index < this.code.length - 1) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[name="code${index + 1}"]`);
      nextInput?.focus();
    }
  }

  verifyCode() {
    const fullCode = this.code.join('');
    if (fullCode.length === 6) {
      console.log('Verifying code:', fullCode);
      // Add actual verification logic here
    } else {
      alert('Please enter the full 6-digit code.');
    }
  }
}
