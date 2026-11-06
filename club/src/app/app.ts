import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { Toolbar } from './toolbar/toolbar';

@Component({
  imports: [RouterOutlet, Toolbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly authentication = inject(AuthenticationService);
}
