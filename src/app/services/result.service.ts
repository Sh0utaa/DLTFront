import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResultService {
    private resultSource = new BehaviorSubject<any>(null);
    currentResult = this.resultSource.asObservable();

    constructor() { }

    changeResult(result: any) {
        this.resultSource.next(result);
    }
}