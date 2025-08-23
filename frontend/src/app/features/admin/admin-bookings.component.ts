import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BookingService, Booking } from '../bookings/services/booking.service';
import { CarService, Car } from '../cars/services/car.service';
import { UsersService, UserBrief } from '../../core/services/users.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ChangeStatusDialogComponent } from './change-status-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-admin-bookings',
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule],
  template: `
    <div class="admin-bookings">
      <div class="header">
        <h2>All Bookings</h2>
        <div class="controls">
          <button mat-flat-button color="primary" (click)="loadBookings(1)">Refresh</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><mat-spinner diameter="36"></mat-spinner></div>

      <table mat-table [dataSource]="bookings" class="mat-elevation-z2" *ngIf="!loading">
        <ng-container matColumnDef="bookingId">
          <th mat-header-cell *matHeaderCellDef> Booking ID </th>
          <td mat-cell *matCellDef="let b"> {{b.id}} </td>
        </ng-container>

        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef> User </th>
          <td mat-cell *matCellDef="let b"> {{ userName(b.user_id) }} </td>
        </ng-container>

        <ng-container matColumnDef="car">
          <th mat-header-cell *matHeaderCellDef> Car </th>
          <td mat-cell *matCellDef="let b"> {{ carTitle(b.car_id) }} </td>
        </ng-container>

        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef> Dates </th>
          <td mat-cell *matCellDef="let b"> {{b.start_date | date:'shortDate'}} - {{b.end_date | date:'shortDate'}} </td>
        </ng-container>

        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef> Total </th>
          <td mat-cell *matCellDef="let b"> {{b.total_amount | currency}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Status </th>
          <td mat-cell *matCellDef="let b">
            <mat-chip [color]="b.status === 'pending' ? 'warn' : (b.status === 'confirmed' ? 'primary' : '')" selected>
              {{b.status | titlecase}}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let b" class="actions-cell">
            <button mat-icon-button matTooltip="View" class="action view" (click)="viewBooking(b)"><mat-icon>visibility</mat-icon></button>
            <button mat-icon-button matTooltip="Change Status" class="action edit" (click)="changeStatus(b)"><mat-icon>autorenew</mat-icon></button>
            <button mat-icon-button matTooltip="Cancel" class="action delete" (click)="cancelBooking(b)"><mat-icon>cancel</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="pagination" *ngIf="pagination.pages > 1">
        <button mat-icon-button (click)="loadBookings(pagination.page - 1)" [disabled]="pagination.page === 1"><mat-icon>chevron_left</mat-icon></button>
        <span>Page {{pagination.page}} of {{pagination.pages}}</span>
        <button mat-icon-button (click)="loadBookings(pagination.page + 1)" [disabled]="pagination.page === pagination.pages"><mat-icon>chevron_right</mat-icon></button>
      </div>
    </div>
  `,
  styles: [
    `
    .admin-bookings { padding: 24px; max-width: 1100px; margin: 0 auto; }
    .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    table { width:100%; border-radius:8px; overflow:hidden; }
    th.mat-header-cell { background: linear-gradient(90deg,#fff3e0,#fff8e1); font-weight:700; }
    .actions-cell { display:flex; gap:8px; }
    .action { width:44px; height:44px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 6px 18px rgba(12,35,64,0.08); transition:transform .12s ease; }
    .action.view { background: linear-gradient(90deg,#00c853,#00e676); }
    .action.edit { background: linear-gradient(90deg,#2979ff,#00b0ff); }
    .action.delete { background: linear-gradient(90deg,#f06292,#ff4081); }
    .action mat-icon{ font-size:18px; }
    .loading{ display:flex; justify-content:center; padding:24px; }
    .pagination{ display:flex; gap:12px; align-items:center; justify-content:center; margin-top:16px; }
    `
  ]
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  displayedColumns = ['bookingId','user','car','dates','amount','status','actions'];
  pagination = { page: 1, limit: 20, total: 0, pages: 1 };

  statuses = ['pending','confirmed','active','completed','cancelled'];

  // simple caches to avoid repeated requests
  private userCache: Record<string, UserBrief> = {};
  private carCache: Record<string, Car> = {};

  constructor(private bookingSvc: BookingService, private router: Router, private dialog: MatDialog, private usersSvc: UsersService, private carSvc: CarService) {}

  ngOnInit(): void { this.loadBookings(1); }

  loadBookings(page = 1) {
    this.loading = true;
    this.bookingSvc.getAllBookings({ page, limit: this.pagination.limit }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.bookings = res.data.items || res.data.bookings || [];
        this.pagination.page = res.data.page || 1;
        this.pagination.limit = res.data.limit || this.pagination.limit;
        this.pagination.total = res.data.total || 0;
        this.pagination.pages = res.data.totalPages || res.data.pages || 1;
        this.loadRelatedFor(this.bookings);
      },
      error: () => { this.loading = false; }
    });
  }

  private loadRelatedFor(list: Booking[]) {
    const usersToLoad = new Set<string>();
    const carsToLoad = new Set<string>();
    list.forEach(b => {
      if (b.user_id && !this.userCache[b.user_id]) usersToLoad.add(b.user_id);
      if (b.car_id && !this.carCache[b.car_id]) carsToLoad.add(b.car_id);
    });

    usersToLoad.forEach(id => {
      this.usersSvc.getUserById(id).subscribe({ next: (res: any) => { if (res?.data) this.userCache[id] = res.data.user; }, error: () => {} });
    });

    carsToLoad.forEach(id => {
      this.carSvc.getCarById(id).subscribe({ next: (res: any) => { if (res?.data) this.carCache[id] = res.data.car; }, error: () => {} });
    });
  }

  viewBooking(b: Booking) { this.router.navigate(['/bookings', b.id]); }

  changeStatus(b: Booking) {
    const ref = this.dialog.open(ChangeStatusDialogComponent, { data: { current: b.status, statuses: this.statuses }, width: '360px' });
    ref.afterClosed().subscribe((next: string | undefined) => {
      if (!next) return;
      this.bookingSvc.updateBookingStatus(b.id, next).subscribe({ next: () => this.loadBookings(this.pagination.page), error: (e) => console.error(e) });
    });
  }

  cancelBooking(b: Booking) {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Cancel Booking', message: 'Are you sure you want to cancel this booking?' }, width: '360px' });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.bookingSvc.cancelBooking(b.id).subscribe({ next: () => this.loadBookings(this.pagination.page), error: (e) => console.error(e) });
    });
  }

  // helpers for template
  userName(id: string) {
    const u = this.userCache[id];
    return u ? `${u.first_name} ${u.last_name}` : id;
  }

  carTitle(id: string) {
    const c = this.carCache[id];
    return c ? `${c.make} ${c.model}` : id;
  }
}
