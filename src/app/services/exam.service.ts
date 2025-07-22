import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Question } from "./question.model";
import { catchError, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ExamService {

    constructor(
        private http: HttpClient
    ) {}


    fetchQuestions(selectedCategoryId: number, selectedLanguage: string): Observable<Question[] | string> {
        const url = `${environment.apiUrl}/api/questions/exam/${selectedCategoryId}?language=${selectedLanguage}`;

        return this.http.get<Question[]>(url, {
            withCredentials: true,
            responseType: "json"
        }).pipe(
            catchError(err => {
                console.error("Error fetching questions: ", err);
                return of("failed to load questions.");
            })
        )
    }
}