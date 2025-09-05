import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  status: string;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private getBaseUrl(endpoint: string): string {
    if (endpoint.startsWith('users')) return environment.api.user;
    if (endpoint.startsWith('cars')) return environment.api.car;
    if (endpoint.startsWith('bookings')) return environment.api.booking;
    if (endpoint.startsWith('payments')) return environment.api.payment;
    if (endpoint.startsWith('notifications')) return environment.api.notification;
    return '';
  }

  constructor(private http: HttpClient) {}

  // Generic HTTP methods
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
  const baseUrl = this.getBaseUrl(endpoint);
  return this.http.get<T>(`${baseUrl}/${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    // If data is FormData, do not set Content-Type header (browser will set it)
    const baseUrl = this.getBaseUrl(endpoint);
    if (data instanceof FormData) {
      return this.http.post<T>(`${baseUrl}/${endpoint}`, data);
    }
    return this.http.post<T>(`${baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
  const baseUrl = this.getBaseUrl(endpoint);
  return this.http.put<T>(`${baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
  const baseUrl = this.getBaseUrl(endpoint);
  return this.http.delete<T>(`${baseUrl}/${endpoint}`);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
  const baseUrl = this.getBaseUrl(endpoint);
  return this.http.patch<T>(`${baseUrl}/${endpoint}`, data);
  }
}