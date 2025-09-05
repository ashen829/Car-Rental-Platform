import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

import { CarService, Car } from '../../services/car.service';
import { Observable, of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-car-list',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarList implements OnInit {
  cars : any;
  isLoading = false;
  searchForm: FormGroup;
  page = 1;
  limit = 6;
  total = 0;
  totalPages = 1;

  constructor(
    private carService: CarService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      category: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pickup_location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(page: number = 1): void {
    this.isLoading = true;
    this.carService.getAllCars({ page, limit: this.limit }).subscribe({
      next: (response: any) => {
        const data = response.data;
        // Try both possible keys for car array
        const cars = data.cars || data.items || [];
        // Convert image buffer to base64 for each car
        this.cars = cars.map((car: any) => {
          if (car.image && car.image.data && Array.isArray(car.image.data)) {
            const binary = new Uint8Array(car.image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            car.imageBase64 = 'data:image/jpeg;base64,' + btoa(binary);
          } else {
            car.imageBase64 = null;
          }
          return car;
        });
        this.page = data.page || data.pagination?.page || 1;
        this.total = data.total || data.pagination?.total || 0;
        this.totalPages = data.totalPages || data.pagination?.pages || data.pagination?.totalPages || 1;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load cars:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;
    this.isLoading = true;
    const { category, start_date, end_date, pickup_location } = this.searchForm.value;
    const params = [
      category ? `category=${encodeURIComponent(category)}` : '',
      start_date ? `start_date=${encodeURIComponent(start_date)}` : '',
      end_date ? `end_date=${encodeURIComponent(end_date)}` : '',
      pickup_location ? `pickup_location=${encodeURIComponent(pickup_location)}` : ''
    ].filter(Boolean).join('&');
    const url = `http://localhost:3000/cars/search?${params}`;
    this.http.post<any>(url, {}).subscribe({
      next: (res) => {
        const cars = res.data?.items || [];
        this.cars = cars.map((car: any) => {
          if (car.image && car.image.data && Array.isArray(car.image.data)) {
            const binary = new Uint8Array(car.image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            car.imageBase64 = 'data:image/jpeg;base64,' + btoa(binary);
          } else {
            car.imageBase64 = null;
          }
          return car;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.isLoading = false;
      }
    });
  }


  goToDetails(car: any): void {
    this.router.navigate(['/cars', car.id]);
  }
}

export interface PaginatedResponse<T> {
  status: string;
  data: {
    cars: T[];
    pagination: {
      page: number;
      total: number;
      pages: number;
      totalPages?: number;
    }
  };
}
