import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  phone?: string;
  license_number?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  license_number?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'car_rental_token';
  private userKey = 'car_rental_user';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/users/register`, userData)
      .pipe(
        tap(response => {
          if (response.status === 'success' && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
        })
      );
  }

  private setSession(authData: { user: User; token: string }): void {
    localStorage.setItem(this.tokenKey, authData.token);
    localStorage.setItem(this.userKey, JSON.stringify(authData.user));
    this.currentUserSubject.next(authData.user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}