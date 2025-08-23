import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Car } from '../../services/car.service';

@Component({
  selector: 'booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatDividerModule
  ],
  template: `
    <mat-card class="booking-card">
      <mat-card-header>
        <mat-card-title>Book {{data.car.make}} {{data.car.model}}</mat-card-title>
        <mat-card-subtitle>{{data.car.year}} • {{data.car.category | titlecase}}</mat-card-subtitle>
      </mat-card-header>
      <mat-divider></mat-divider>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()" class="booking-form">
          <div class="dates-row">
            <mat-form-field appearance="outline">
              <mat-label>Start</mat-label>
              <input matInput [min]="minDate" [matDatepicker]="startPicker" formControlName="start_date" placeholder="Choose a start date">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End</mat-label>
              <input matInput [min]="form.value.start_date || minDate" [matDatepicker]="endPicker" formControlName="end_date" placeholder="Choose an end date">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Pick Up Location</mat-label>
            <input matInput formControlName="pickup_location" placeholder="Where you'll pick up the car">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dropoff Location</mat-label>
            <input matInput formControlName="dropoff_location" placeholder="Where you'll drop it off">
          </mat-form-field>

          <div class="summary">
            <div class="summary-left">
              <div class="days">Days: <strong>{{rentalDays}}</strong></div>
              <div class="rate">Rate: <strong>
                {{data.car.daily_rate | currency}}</strong></div>
            </div>
            <div class="summary-right">
              <div class="total">Total: <strong>{{totalPrice | currency}}</strong></div>
            </div>
          </div>

          <div class="actions">
            <button mat-stroked-button type="button" (click)="dialogRef.close()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isLoading">
              <mat-icon>event_available</mat-icon>
              <span>{{isLoading ? 'Booking...' : 'Confirm Booking'}}</span>
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .booking-form { display: flex; flex-direction: column; gap: 16px; }
      .full-width { width: 100%; }
      .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
      .dates-row { display:flex; gap:12px; }
      .dates-row mat-form-field { flex:1; }
      .summary { display:flex; justify-content:space-between; align-items:center; padding-top:8px; }
      .summary-left { display:flex; flex-direction:column; gap:4px; }
      .booking-card { width:100%; max-width:680px; }
    `
  ]
})
export class BookingDialogComponent {
  form: FormGroup;
  isLoading = false;
  minDate: Date = new Date();
  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { car: Car },
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required]
    });

    // ensure end date cannot be before start date
    this.form.get('start_date')?.valueChanges.subscribe((start: Date) => {
      const endControl = this.form.get('end_date');
      if (!start) return;
      const currentEnd = endControl?.value as Date | null;
      if (currentEnd && currentEnd < start) {
        endControl?.setValue(null);
      }
    });
  }

  get rentalDays(): number {
    const s = this.form.value.start_date as Date | null;
    const e = this.form.value.end_date as Date | null;
    if (!s || !e) return 0;
    const diffMs = e.setHours(0,0,0,0) - s.setHours(0,0,0,0);
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return days > 0 ? days : 0;
  }

  get totalPrice(): number {
    const days = this.rentalDays;
    const rate = this.data?.car?.daily_rate ?? 0;
    return days * rate;
  }

  submit(): void {
    if (this.form.invalid) return;
    // extra validation: end date must be >= start date
    const s = this.form.value.start_date as Date;
    const e = this.form.value.end_date as Date;
    if (s && e && e < s) {
      alert('End date must be the same or after the start date.');
      return;
    }
    this.isLoading = true;
    const token = localStorage.getItem('auth_token') || '';
    const payload = {
      car_id: this.data.car.id,
      // normalize dates to ISO strings for backend
      start_date: s ? new Date(s).toISOString() : null,
      end_date: e ? new Date(e).toISOString() : null,
      pickup_location: this.form.value.pickup_location,
      dropoff_location: this.form.value.dropoff_location
    };
      this.http.post('http://localhost:3000/api/bookings', payload, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': 'Bearer ' + token
        }
      }).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close('success');
        alert('Booking successful!');
      },
      error: (err) => {
        this.isLoading = false;
        alert('Booking failed!');
        console.error('Booking error:', err);
      }
    });
  }
}
