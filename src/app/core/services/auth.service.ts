import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(this.loadUser());
  readonly isAuthenticated = signal<boolean>(!!this.loadUser());

  private loadUser(): User | null {
    const stored = sessionStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  }

  login(credentials: LoginRequest): Observable<any> {
    // Simulate API — in production: return this.http.post('/api/login', credentials)
    if (credentials.userName === 'demo' && credentials.password === 'Demo@1234') {
      const mockUser: User = {
        userId: 1,
        userName: 'Demo User',
        userRole: 'Agent',
        serviceName: 'Helpline 104',
        serviceId: 1,
        stateId: 1,
        stateName: 'Andhra Pradesh',
        token: 'mock-jwt-token-xyz',
      };
      sessionStorage.setItem('userData', JSON.stringify(mockUser));
      this.currentUser.set(mockUser);
      this.isAuthenticated.set(true);
      return of({ status: 200, data: mockUser });
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  getRoles(): Observable<Role[]> {
    return of([
      { RoleID: 1, RoleName: 'Agent', ServiceID: 1, ServiceName: 'Helpline 104' },
      { RoleID: 2, RoleName: 'Supervisor', ServiceID: 1, ServiceName: 'Helpline 104' },
      { RoleID: 3, RoleName: 'SIO', ServiceID: 1, ServiceName: 'Helpline 104' },
    ]);
  }

  logout(): void {
    sessionStorage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
