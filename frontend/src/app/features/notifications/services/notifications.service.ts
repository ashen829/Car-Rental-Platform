import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  status: 'success' | 'error';
  data: {
    notifications: NotificationItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private api: ApiService) {}

  getMyNotifications(page = 1, limit = 20, is_read: '' | 'true' | 'false' = ''): Observable<NotificationsResponse> {
    const params: any = { page, limit };
    if (is_read !== '') params.is_read = is_read;
  return this.api.get<NotificationsResponse>('notifications/my-notifications', params);
  }
}
