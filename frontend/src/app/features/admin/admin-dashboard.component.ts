import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="admin-dashboard">
      <mat-card class="admin-card">
        <mat-card-header>
          <mat-card-title>Admin Dashboard</mat-card-title>
          <mat-card-subtitle>Manage vehicles, users and bookings</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="actions-grid">
            <a mat-card-button class="action-btn vehicles" routerLink="/admin/vehicles">
              <mat-icon>directions_car</mat-icon>
              <span>Manage Vehicles</span>
            </a>
            <a mat-card-button class="action-btn users" routerLink="/admin/users">
              <mat-icon>people</mat-icon>
              <span>Manage Users</span>
            </a>
            <a mat-card-button class="action-btn bookings" routerLink="/admin/bookings">
              <mat-icon>book_online</mat-icon>
              <span>Manage Bookings</span>
            </a>
            <a mat-card-button class="action-btn add-vehicle" routerLink="/admin/vehicles/add">
              <mat-icon>add</mat-icon>
              <span>Add Vehicles</span>
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .admin-dashboard { padding: 32px; display:flex; justify-content:center; }
    .admin-card { width:100%; max-width:980px; border-radius:14px; box-shadow: 0 12px 40px rgba(12,35,64,0.08); }
    .actions-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; margin-top:18px; }
    .action-btn { display:flex; align-items:center; justify-content:center; gap:12px; padding:20px; border-radius:12px; text-decoration:none; color:#fff; font-weight:700; }
    .action-btn mat-icon { font-size:28px; }
  .vehicles { background: linear-gradient(90deg,#00c6ff,#0072ff); }
  .users { background: linear-gradient(90deg,#7b1fa2,#8e24aa); }
  .bookings { background: linear-gradient(90deg,#ff8a65,#ff5252); }
  .add-vehicle { background: linear-gradient(90deg,#00e676,#66bb6a); }
    @media (max-width: 900px) { .actions-grid { grid-template-columns: 1fr; } }
    `
  ]
})
export class AdminDashboardComponent {}
