import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [MatButtonModule, RouterLink],
  template: `
    <main>
      <h1>{{ title }}</h1>
      <p>Cet écran sera disponible prochainement.</p>
      <a mat-button routerLink="/">Retour à l’accueil</a>
    </main>
  `,
  styles: `
    main {
      margin: 0 auto;
      max-width: 1200px;
      padding: 1.5rem;
    }
  `,
})
export class ScreenPlaceholder {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = this.route.snapshot.data['title'] as string;
}
