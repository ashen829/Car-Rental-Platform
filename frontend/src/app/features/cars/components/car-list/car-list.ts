import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { CarService, Car } from '../../services/car.service';
import { Observable, of } from 'rxjs';

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
    MatSelectModule
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss'
})
export class CarList {
  cars$: Observable<Car[]> = of([]);
  isLoading = false;

  // Mock data for demonstration
  mockCars: Car[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      license_plate: 'ABC123',
      color: 'White',
      category: 'midsize',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      daily_rate: 50,
      features: ['Air Conditioning', 'Bluetooth'],
      image_url: 'https://via.placeholder.com/300x200',
      is_available: true,
      location: 'Downtown'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      license_plate: 'XYZ789',
      color: 'Blue',
      category: 'economy',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seats: 5,
      daily_rate: 40,
      features: ['Air Conditioning', 'Backup Camera'],
      image_url: 'https://via.placeholder.com/300x200',
      is_available: true,
      location: 'Airport'
    }
  ];

  constructor(private carService: CarService) {
    this.cars$ = of(this.mockCars);
  }

  loadCars(): void {
    this.isLoading = true;
    // For now, use mock data. In a real app, this would call the service
    // this.carService.getAllCars().subscribe({
    //   next: (response) => {
    //     this.cars$ = of(response.data.items);
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Failed to load cars:', error);
    //     this.isLoading = false;
    //   }
    // });
  }
}
