import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';

export interface UserBrief {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private api: ApiService) {}

  getUserById(id: string): Observable<ApiResponse<UserBrief>> {
    return this.api.get<ApiResponse<UserBrief>>(`users/${id}`);
  }
}
