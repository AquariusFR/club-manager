import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Main } from './main';
import { routes } from '../app.routes';
import { TokenStorageService } from '../authentication/token-storage.service';

describe('Main', () => {
  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  afterEach(() => {
    TestBed.inject(TokenStorageService).clear();
  });

  it('shows six cards and navigates to the selected placeholder screen', async () => {
    TestBed.inject(TokenStorageService).setSession('valid-token', 3600);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Main);

    const cards = harness.routeNativeElement?.querySelectorAll('a.screen-card');
    expect(cards?.length).toBe(6);
    expect(Array.from(cards ?? [], (card) => card.getAttribute('href'))).toEqual([
      '/news',
      '/calendrier',
      '/mon-equipe',
      '/entrainements',
      '/staff',
      '/administration',
    ]);

    cards?.[0].dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/news');
    expect(harness.routeNativeElement?.textContent).toContain('Cet écran sera disponible prochainement.');
  });
});
