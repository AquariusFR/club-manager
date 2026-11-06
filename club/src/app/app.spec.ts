import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './login/login.component';
import { routes } from './app.routes';
import { TokenStorageService } from './authentication/token-storage.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideRouter(routes)],
    })
      .compileComponents();
  });

  afterEach(() => {
    TestBed.inject(TokenStorageService).clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the login page', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Connexion');
  });

  it('should render the toolbar only when authenticated', async () => {
    const tokenStorage = TestBed.inject(TokenStorageService);
    tokenStorage.setSession('valid-token', 3600);

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-toolbar')).not.toBeNull();

    tokenStorage.clear();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-toolbar')).toBeNull();
  });
});
