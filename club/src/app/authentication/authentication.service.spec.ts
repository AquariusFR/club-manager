import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { jwtInterceptor } from './jwt.interceptor';

describe('AuthenticationService', () => {
  let authentication: AuthenticationService | undefined;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    authentication?.logout();
    httpTestingController.verify();
  });

  it('sends login credentials and adds the JWT to later requests', () => {
    authentication = TestBed.inject(AuthenticationService);
    authentication.login('mymail@example.com', 'mypassword').subscribe();

    const loginRequest = httpTestingController.expectOne('/authentication/login');
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual({
      mail: 'mymail@example.com',
      password: 'mypassword',
    });
    loginRequest.flush({
      success: true,
      token: 'jwt-token',
      expires_in: 3600,
    });

    TestBed.inject(HttpClient).get('/api/club/teams').subscribe();
    const apiRequest = httpTestingController.expectOne('/api/club/teams');
    expect(apiRequest.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    apiRequest.flush([]);
  });

  it('does not restore an expired token', () => {
    localStorage.setItem(
      'club-manager.session',
      JSON.stringify({ token: 'expired-token', expiresAt: Date.now() - 1 }),
    );

    authentication = TestBed.inject(AuthenticationService);

    expect(authentication.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('club-manager.session')).toBeNull();
  });

  it('clears the session when an API request is unauthorized', () => {
    authentication = TestBed.inject(AuthenticationService);
    authentication.login('mymail@example.com', 'mypassword').subscribe();
    httpTestingController.expectOne('/authentication/login').flush({
      success: true,
      token: 'jwt-token',
      expires_in: 3600,
    });

    TestBed.inject(HttpClient)
      .get('/api/club/teams')
      .subscribe({ error: () => undefined });
    httpTestingController.expectOne('/api/club/teams').flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(authentication.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('club-manager.session')).toBeNull();
  });
});
