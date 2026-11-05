import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

interface LoginResponse {
  success: boolean;
  token: string;
  expires_in: number;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  readonly isAuthenticated = computed(() => this.tokenStorage.token() !== null);

  login(mail: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>('/authentication/login', { mail, password })
      .pipe(
        map((response) => {
          if (
            response.success !== true ||
            typeof response.token !== 'string' ||
            typeof response.expires_in !== 'number'
          ) {
            throw new Error('Invalid authentication response.');
          }

          this.tokenStorage.setSession(response.token, response.expires_in);
        }),
      );
  }

  logout(): void {
    this.tokenStorage.clear();
  }
}
