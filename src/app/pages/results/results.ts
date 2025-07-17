import { Component } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterLink],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results {
  result: any

  constructor(private resultService: ResultService, 
    private router: Router
) {}

  ngOnInit() {
    this.resultService.currentResult.subscribe(result => {
      if (!result) { this.router.navigate(['/'])}
      else {
        this.result = result;
        console.log(result);
      }
    })
  }
}
