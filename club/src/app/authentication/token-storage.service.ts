import { Injectable, signal } from '@angular/core';

interface StoredSession {
  token: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly storageKey = 'club-manager.session';
  private readonly tokenSignal = signal<string | null>(null);
  private expiresAt: number | null = null;
  private expirationTimer: number | undefined;

  readonly token = this.tokenSignal.asReadonly();

  constructor() {
    this.restoreSession();
  }

  getToken(): string | null {
    if (this.expiresAt !== null && this.expiresAt <= Date.now()) {
      this.clear();
    }

    return this.tokenSignal();
  }

  setSession(token: string, expiresInSeconds: number): void {
    if (!token || !Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
      throw new Error('Invalid authentication session.');
    }

    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(this.storageKey, JSON.stringify({ token, expiresAt }));
    this.setSessionState(token, expiresAt);
  }

  clear(): void {
    if (this.expirationTimer !== undefined) {
      window.clearTimeout(this.expirationTimer);
      this.expirationTimer = undefined;
    }

    this.tokenSignal.set(null);
    this.expiresAt = null;
    localStorage.removeItem(this.storageKey);
  }

  private restoreSession(): void {
    const storedValue = localStorage.getItem(this.storageKey);
    if (storedValue === null) {
      return;
    }

    try {
      const session = JSON.parse(storedValue) as Partial<StoredSession>;
      if (
        typeof session.token !== 'string' ||
        session.token.length === 0 ||
        typeof session.expiresAt !== 'number' ||
        !Number.isFinite(session.expiresAt) ||
        session.expiresAt <= Date.now()
      ) {
        this.clear();
        return;
      }

      this.setSessionState(session.token, session.expiresAt);
    } catch {
      this.clear();
    }
  }

  private setSessionState(token: string, expiresAt: number): void {
    if (this.expirationTimer !== undefined) {
      window.clearTimeout(this.expirationTimer);
    }

    this.tokenSignal.set(token);
    this.expiresAt = expiresAt;
    this.expirationTimer = window.setTimeout(
      () => this.clear(),
      Math.max(0, expiresAt - Date.now()),
    );
  }
}
