import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from './question.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam.html',
})
export class Exam {
  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private resultService: ResultService,
    private router: Router
  ) {}

  questions: Question[] = [];
  examStarted = false;
  isLoading = false;
  errorMessage = '';
  userData: any;
  questionsLoading = false;
  currentQuestionIndex = 0;
  selectedAnswers: { [questionId: number]: number } = {};
  jumpToIndex: number | null = null;

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

  // Start exam handler
  startExam() {
    if (!this.selectedCategoryId) {
      alert("Please select a category.");
      return;
    }

    this.validateUser(() => {
      // This callback will only be executed if validation succeeds
      this.examStarted = true;
      this.fetchQuestions();
    });
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  jumpToQuestion() {
      if (
    this.jumpToIndex !== null &&
    this.jumpToIndex >= 1 &&
    this.jumpToIndex <= this.questions.length
  ) {
    this.currentQuestionIndex = this.jumpToIndex - 1;
    this.jumpToIndex = null; // optional: reset input
  } else {
    alert('Invalid question number.');
  }
  }

  // Validate user with a callback for success
  validateUser(onSuccess: () => void) {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.validateUser()
      .pipe(
        catchError((err) => {
          console.error('Authentication error:', err);
          this.errorMessage = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
          return of(null); // Return observable to prevent error propagation
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.userData = res;
            console.log("User authenticated successfully");
            onSuccess(); // Execute the success callback
          }
        }
      });
  }

  fetchQuestions() {
    this.questionsLoading = true;

    const url = `http://localhost:5279/api/questions/exam/${this.selectedCategoryId}?language=${this.selectedLanguage}`;

    this.http.get<Question[]>(url, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      finalize(() => {
        this.questionsLoading = false;
      })
    ).subscribe({
      next: (questions) => {
        this.questions = questions;
        console.log('Questions received:', questions);
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
        this.errorMessage = 'Failed to load questions.';
      }
    });
  }

  // Select a category
  selectCategory(id: number) {
    this.selectedCategoryId = id;
  }

  selectAnswer(questionId: number, answerId: number) {
    this.selectedAnswers[questionId] = answerId;
  }

  getAnswerJson() {
    return Object.entries(this.selectedAnswers).map(([questionId, answerId]) => ({
      questionId: Number(questionId),
      answerId: Number(answerId)
    }));
  }

  submit() {
    const answeredCount = Object.keys(this.selectedAnswers).length;

    if (answeredCount !== this.questions.length) {
      alert(`You have answered ${answeredCount} out of ${this.questions.length} questions.`);
      return;
    }

    const payload = this.getAnswerJson(); // Prepare the payload

    this.http.post('http://localhost:5279/api/questions/submit', payload, {
      withCredentials: true,
      responseType: 'json',
    }).subscribe({
      next: (response) => {
        console.log('Submission successful:', response);
        alert('Your answers have been submitted successfully!');

        this.resultService.changeResult(response);

        this.router.navigate(['/results'])
      },
      error: (err) => {
        console.error('Submission failed:', err);
        alert('There was an error submitting your answers.');
      }
    });
  }


  // Final payload to store or send
  get selectionJson() {
    return {
      language: this.selectedLanguage,
      categoryId: this.selectedCategoryId
    };
  }
}