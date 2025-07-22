import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuItems = [
    { icon: 'home', imgSrc: 'assets/svgs/house.svg' },
    { icon: 'leaderboards', imgSrc: 'assets/svgs/bar-chart.svg' },
    { icon: 'info', imgSrc: 'assets/svgs/info-circle.svg' },
    { icon: 'login', imgSrc: 'assets/svgs/person-circle.svg' },
  ];
}
