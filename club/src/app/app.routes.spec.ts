import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { TokenStorageService } from './authentication/token-storage.service';

describe('routes', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter(routes)],
    });
  });

  afterEach(() => {
    TestBed.inject(TokenStorageService).clear();
  });

  it('redirects unauthenticated users from the main route to login', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/login');
    expect(harness.routeNativeElement?.textContent).toContain('Connexion');
  });

  it('allows authenticated users to open the main route', async () => {
    localStorage.setItem(
      'club-manager.session',
      JSON.stringify({ token: 'valid-token', expiresAt: Date.now() + 60_000 }),
    );
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/');
    expect(harness.routeNativeElement?.textContent).toContain('main works!');
  });
});
