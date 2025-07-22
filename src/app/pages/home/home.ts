import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for two-way binding
import { AuthService } from '../../services/auth.service';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Question } from '../exam/question.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule], // Added FormsModule
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  examStarted = false;
  loading = false;
  questionsLoading = false;
  errorMessage: string | null = null;
  questions: Question[] = []; // Fixed type - should only be Question[]
  jumpToIndex: number | null = null;
  currentQuestionIndex = 0;
  selectedAnswers: { [questionId: number]: number } = {};

  constructor(private examService: ExamService, private authService: AuthService, private router: Router) {}

  startExam() {
    this.examStarted = false;
    this.loading = true;
    this.questionsLoading = true; // Set questionsLoading to true
    this.errorMessage = null;
    
    // First validate the user session
    this.authService.validateUser().pipe(
      // If validation succeeds, proceed to fetch questions
      switchMap(() => this.examService.fetchQuestions(2, "en")),
      catchError((error) => {
        console.error('Error:', error);
        this.errorMessage = error.status === 401 
          ? 'Session expired. Please login again.'
          : 'An unexpected error occurred';
        
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return of(null); // Return null to continue the stream
      }),
      finalize(() => {
        this.loading = false;
        this.questionsLoading = false; // Set questionsLoading to false
      })
    ).subscribe({
      next: (questions) => {
        if (questions) {
          // Check if the response is an error string
          if (typeof questions === 'string') {
            this.errorMessage = questions;
            return;
          }
          
          this.examStarted = true;
          this.questions = questions as Question[];
          console.log('Questions loaded:', this.questions);
        }
      },
      error: (err) => {
        // This will only be called if there's an error after catchError
        console.error('Unexpected error after handling:', err);
        this.errorMessage = 'An unexpected error occurred';
      }
    });
  }

  // Navigate to previous question
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Navigate to next question
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  // Jump to specific question
  jumpToQuestion() {
    if (this.jumpToIndex && this.jumpToIndex >= 1 && this.jumpToIndex <= this.questions.length) {
      this.currentQuestionIndex = this.jumpToIndex - 1;
      this.jumpToIndex = null;
    }
  }

  // Handle answer selection
  onAnswerSelect(questionId: number, answerId: number) {
    this.selectedAnswers[questionId] = answerId;
  }

  // Submit exam
  submitExam() {
    // Add your exam submission logic here
    console.log('Selected answers:', this.selectedAnswers);
    // Example: this.examService.submitExam(this.selectedAnswers);
  }
}