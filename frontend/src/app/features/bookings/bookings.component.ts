import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingService } from './services/booking.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Booking {
  id: string;
  car: {
    id: string;
    make?: string;
    model?: string;
    image_url?: string;
    daily_rate?: number;
  };
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <mat-card>
      <mat-card-title>Your Bookings</mat-card-title>
      <mat-card-content>
        <div *ngIf="loading" class="loading">
          <mat-spinner diameter="36"></mat-spinner>
        </div>

        <table mat-table [dataSource]="bookings" class="mat-elevation-z1" *ngIf="!loading">

          <!-- Image -->
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Car</th>
            <td mat-cell *matCellDef="let b">
              <img *ngIf="b.car?.image_url" [src]="b.car.image_url" alt="car" class="thumb">
            </td>
          </ng-container>

          <!-- Start Date -->
          <ng-container matColumnDef="start">
            <th mat-header-cell *matHeaderCellDef>Start Date</th>
            <td mat-cell *matCellDef="let b">{{b.start_date | date:'mediumDate'}}</td>
          </ng-container>

          <!-- End Date -->
          <ng-container matColumnDef="end">
            <th mat-header-cell *matHeaderCellDef>End Date</th>
            <td mat-cell *matCellDef="let b">{{b.end_date | date:'mediumDate'}}</td>
          </ng-container>

          <!-- Pickup -->
          <ng-container matColumnDef="pickup">
            <th mat-header-cell *matHeaderCellDef>Pick up</th>
            <td mat-cell *matCellDef="let b">{{b.pickup_location}}</td>
          </ng-container>

          <!-- Dropoff -->
          <ng-container matColumnDef="dropoff">
            <th mat-header-cell *matHeaderCellDef>Drop off</th>
            <td mat-cell *matCellDef="let b">{{b.dropoff_location}}</td>
          </ng-container>

          <!-- Status -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let b">{{b.status | titlecase}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <p *ngIf="!loading && bookings.length === 0">You have no bookings yet.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .thumb { width: 80px; height: 56px; object-fit: cover; border-radius: 4px; }
      table { width: 100%; }
      .loading { display:flex; justify-content:center; padding: 24px 0; }
    `
  ]
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  displayedColumns = ['image','start','end','pickup','dropoff','status'];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getUserBookings().subscribe({
      next: (res) => {

        this.bookings = (res as any).data.bookings || (res as any).results || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch bookings', err);
        this.loading = false;
      }
    });
  }
}
