import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Car } from '../../services/car.service';

@Component({
  selector: 'app-car-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss'
})
export class CarDetail implements OnInit {
  car: Car | null = null;
  carId: string | null = null;

  // Mock car data
  mockCar: Car = {
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
    features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Heated Seats'],
    image_url: 'https://via.placeholder.com/800x400',
    is_available: true,
    location: 'Downtown Office'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');
    // For demo purposes, use mock data
    this.car = this.mockCar;
    
    // In a real app, you would fetch car details:
    // this.carService.getCarById(this.carId!).subscribe({
    //   next: (response) => this.car = response.data,
    //   error: (error) => console.error('Failed to load car:', error)
    // });
  }
}
