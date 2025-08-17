import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse, PaginatedResponse } from '../../../core/services/api.service';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  category: 'economy' | 'midsize' | 'suv' | 'luxury' | 'truck';
  transmission: 'manual' | 'automatic';
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  daily_rate: number;
  features: string[];
  image_url?: string;
  is_available: boolean;
  location?: string;
}

export interface CarSearchParams {
  start_date?: string;
  end_date?: string;
  category?: string;
  available_only?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  category: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  daily_rate: number;
  features: string[];
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  constructor(private apiService: ApiService) {}

  getAllCars(params?: CarSearchParams): Observable<PaginatedResponse<Car>> {
    return this.apiService.get<PaginatedResponse<Car>>('cars', params);
  }

  searchCars(params: CarSearchParams): Observable<PaginatedResponse<Car>> {
    return this.apiService.get<PaginatedResponse<Car>>('cars/search', params);
  }

  getCarById(id: string): Observable<ApiResponse<Car>> {
    return this.apiService.get<ApiResponse<Car>>(`cars/${id}`);
  }

  createCar(carData: CreateCarRequest): Observable<ApiResponse<Car>> {
    return this.apiService.post<ApiResponse<Car>>('cars', carData);
  }

  updateCar(id: string, carData: Partial<CreateCarRequest>): Observable<ApiResponse<Car>> {
    return this.apiService.put<ApiResponse<Car>>(`cars/${id}`, carData);
  }

  deleteCar(id: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`cars/${id}`);
  }

  updateAvailability(id: string, isAvailable: boolean): Observable<ApiResponse<Car>> {
    return this.apiService.put<ApiResponse<Car>>(`cars/${id}/availability`, { is_available: isAvailable });
  }
}