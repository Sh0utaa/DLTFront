import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
})
export class Exam {
  // Category list
  categories = [
    { id: 1, label: 'A, A1' },
    { id: 10, label: 'AM', isNew: true },
    { id: 2, label: 'B, B1' },
    { id: 3, label: 'C' },
    { id: 4, label: 'C1' },
    { id: 5, label: 'D' },
    { id: 6, label: 'D1' },
    { id: 7, label: 'T, S' },
    { id: 8, label: 'Tram' },
    { id: 9, label: 'B+C1 Mil' },
  ];

  selectedCategoryId: number | null = null;
  selectedLanguage: 'en' | 'ka' = 'en';

  // Final payload to store or send
  get selectionJson() {
    return {
      language: this.selectedLanguage,
      categoryId: this.selectedCategoryId
    };
  }

  // Select a category
  selectCategory(id: number) {
    this.selectedCategoryId = id;
  }

  // Start exam handler
  startExam() {
    if (this.selectedCategoryId) {
      console.log('Starting exam with:', this.selectionJson);
      // you can send this.selectionJson to backend or store it
    } else {
      alert('Please select a category.');
    }
  }
}
