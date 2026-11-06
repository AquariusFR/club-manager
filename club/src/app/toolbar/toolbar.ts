import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
@Component({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  selector: 'app-toolbar',
  styleUrl: './toolbar.css',
  templateUrl: './toolbar.html',
})
export class Toolbar {
  private readonly router = inject(Router);
  private readonly authentication = inject(AuthenticationService);

  protected logout(): void {
    this.authentication.logout();
    this.router.navigateByUrl('/login');
  }
}
