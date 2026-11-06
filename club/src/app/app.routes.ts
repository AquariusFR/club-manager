import { Routes } from '@angular/router';
import { authGuard } from './authentication/auth.guard';
import { LoginComponent } from './login/login.component';
import { Main } from './main/main';

export const routes: Routes = [
  { path: '', component: Main, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/' },
];
