import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, NotificationItem } from './services/notifications.service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-notifications',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="notifications-container">
      <div class="header">
        <h2>Notifications</h2>
        <div class="controls">
          <button mat-button (click)="setFilter('')" [class.active]="filter === ''">All</button>
          <button mat-button (click)="setFilter('false')" [class.active]="filter === 'false'">Unread</button>
          <button mat-button (click)="setFilter('true')" [class.active]="filter === 'true'">Read</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><mat-spinner diameter="36"></mat-spinner></div>

      <mat-list *ngIf="!loading">
        <mat-list-item *ngFor="let n of notifications">
          <mat-icon mat-list-icon>{{n.is_read ? 'drafts' : 'markunread'}}</mat-icon>
          <div mat-line class="title">{{n.title}}</div>
          <div mat-line class="message">{{n.message}}</div>
          <div class="meta">{{n.created_at | date:'medium'}}</div>
        </mat-list-item>
      </mat-list>

      <div class="pagination" *ngIf="pagination.pages > 1">
        <button mat-icon-button (click)="loadPage(pagination.page - 1)" [disabled]="pagination.page === 1">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span>Page {{pagination.page}} of {{pagination.pages}}</span>
        <button mat-icon-button (click)="loadPage(pagination.page + 1)" [disabled]="pagination.page === pagination.pages">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .notifications-container { padding: 20px; max-width: 900px; margin: 0 auto; }
    .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    .controls button.active { background: rgba(63,81,181,0.12); }
    mat-list-item { border-bottom: 1px solid #eee; }
    .title { font-weight:700; }
    .message { color: #555; }
    .meta { font-size: 0.8rem; color: #888; }
    .pagination{ display:flex; align-items:center; gap:12px; justify-content:center; margin-top:16px; }
    .loading{ display:flex; justify-content:center; padding:24px; }
    `
  ]
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationItem[] = [];
  loading = false;
  filter: '' | 'true' | 'false' = '';
  pagination = { page: 1, limit: 20, total: 0, pages: 1 };

  constructor(private svc: NotificationsService) {}

  ngOnInit(): void { this.loadPage(1); }

  setFilter(f: '' | 'true' | 'false') {
    this.filter = f;
    this.loadPage(1);
  }

  loadPage(page = 1) {
    this.loading = true;
    this.svc.getMyNotifications(page, this.pagination.limit, this.filter).subscribe({
      next: res => {
        this.loading = false;
        this.notifications = res.data.notifications;
        this.pagination.page = res.data.pagination.page;
        this.pagination.limit = res.data.pagination.limit;
        this.pagination.total = res.data.pagination.total;
        this.pagination.pages = res.data.pagination.pages;
      },
      error: () => { this.loading = false; }
    });
  }

  loadPageRequest(page: number) { this.loadPage(page); }
  loadPageWrapper(page: number) { this.loadPage(page); }
}
