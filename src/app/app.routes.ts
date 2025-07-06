import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Verify } from './pages/verify/verify';
import { Leaderbaords } from './pages/leaderbaords/leaderbaords';
import { Exam } from './pages/exam/exam';
import { Info } from './pages/info/info'
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verify', component: Verify },
  { path: 'leaderboards', component: Leaderbaords },
  { path: 'exam', component: Exam },
  { path: 'info', component: Info },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: '' } 
];
