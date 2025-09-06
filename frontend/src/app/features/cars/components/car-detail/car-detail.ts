import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookingDialogComponent } from './booking-dialog.component';

import { Car } from '../../services/car.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-car-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  MatChipsModule,
  MatDialogModule,
  ReactiveFormsModule,

  ],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss'
})

export class CarDetail implements OnInit {
  car: Car | null = null;
  carId: string | null = null;
  bookingForm: FormGroup;
  isBooking = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');
    if (this.carId) {
      const token = localStorage.getItem('auth_token') || '';
      const url = `http://localhost:30002/api/cars/${this.carId}`;
      const headers = new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${token}`
      });
      this.http.get<any>(url, { headers }).subscribe({
        next: (res) => {
          const car = res.data.car || res;
          if (car.image && car.image.data && Array.isArray(car.image.data)) {
            const binary = new Uint8Array(car.image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            car.imageBase64 = 'data:image/jpeg;base64,' + btoa(binary);
          } else {
            car.imageBase64 = null;
          }
          this.car = car;
        },
        error: (err) => {
          console.error('Failed to load car:', err);
          this.car = null;
        }
      });
    }
  }

  openBookingDialog(): void {
    if (!this.car) return;
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
      data: { car: this.car }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        // Optionally show a success message
      }
    });
  }

}


