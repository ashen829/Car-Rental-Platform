import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse, PaginatedResponse } from '../../../core/services/api.service';

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  car_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
}

export interface UpdateBookingRequest {
  start_date?: string;
  end_date?: string;
  pickup_location?: string;
  dropoff_location?: string;
}

export interface BookingSearchParams {
  status?: string;
  user_id?: string;
  car_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  createBooking(bookingData: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.apiService.post<ApiResponse<Booking>>('bookings', bookingData);
  }

  getUserBookings(params?: BookingSearchParams): Observable<PaginatedResponse<Booking>> {
    return this.apiService.get<PaginatedResponse<Booking>>('bookings/my-bookings', params);
  }

  getAllBookings(params?: BookingSearchParams): Observable<PaginatedResponse<Booking>> {
    return this.apiService.get<PaginatedResponse<Booking>>('bookings', params);
  }

  getBookingById(id: string): Observable<ApiResponse<Booking>> {
    return this.apiService.get<ApiResponse<Booking>>(`bookings/${id}`);
  }

  updateBooking(id: string, bookingData: UpdateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.apiService.put<ApiResponse<Booking>>(`bookings/${id}`, bookingData);
  }

  cancelBooking(id: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`bookings/${id}/cancel`, {});
  }

  updateBookingStatus(id: string, status: string): Observable<ApiResponse<Booking>> {
    return this.apiService.put<ApiResponse<Booking>>(`bookings/${id}/status`, { status });
  }
}