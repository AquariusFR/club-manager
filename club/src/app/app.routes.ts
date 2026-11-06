import { Routes } from '@angular/router';
import { authGuard } from './authentication/auth.guard';
import { LoginComponent } from './login/login.component';
import { Main } from './main/main';
import { ScreenPlaceholder } from './main/screen-placeholder';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', component: Main },
      { path: 'news', component: ScreenPlaceholder, data: { title: 'Gestion des news' } },
      { path: 'calendrier', component: ScreenPlaceholder, data: { title: 'Calendrier du club' } },
      { path: 'mon-equipe', component: ScreenPlaceholder, data: { title: 'Mon équipe' } },
      {
        path: 'entrainements',
        component: ScreenPlaceholder,
        data: { title: 'Base des entraînements' },
      },
      { path: 'staff', component: ScreenPlaceholder, data: { title: 'Gestion du staff' } },
      { path: 'administration', component: ScreenPlaceholder, data: { title: 'Administration' } },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/' },
];
