import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatCardModule, MatIconModule, RouterLink],
  selector: 'app-main',
  styleUrl: './main.css',
  templateUrl: './main.html',
})
export class Main {
  protected readonly screens = [
    {
      title: 'Gestion des news',
      description: 'Rédiger et gérer les actualités du club.',
      icon: 'article',
      path: '/news',
    },
    {
      title: 'Calendrier du club',
      description: 'Retrouver les événements et les rendez-vous du club.',
      icon: 'calendar_month',
      path: '/calendrier',
    },
    {
      title: 'Mon équipe',
      description: 'Consulter les informations de votre équipe.',
      icon: 'groups',
      path: '/mon-equipe',
    },
    {
      title: 'Base des entraînements',
      description: 'Parcourir la bibliothèque des séances.',
      icon: 'sports',
      path: '/entrainements',
    },
    {
      title: 'Gestion du staff',
      description: 'Gérer les éducateurs et les bénévoles.',
      icon: 'badge',
      path: '/staff',
    },
    {
      title: 'Administration',
      description: 'Accéder aux paramètres du club.',
      icon: 'settings',
      path: '/administration',
    },
  ] as const;
}
