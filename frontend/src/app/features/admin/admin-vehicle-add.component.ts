import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CarService } from '../cars/services/car.service';

@Component({
  standalone: true,
  selector: 'app-admin-vehicle-add',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatCardModule],
  template: `
    <div class="vehicle-add">
      <mat-card>
        <mat-card-title>Add Vehicle</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="grid">
              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>directions_car</mat-icon>
                <mat-label>Make</mat-label>
                <input matInput formControlName="make" placeholder="e.g. Toyota" />
                <mat-hint>Brand or manufacturer</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>build</mat-icon>
                <mat-label>Model</mat-label>
                <input matInput formControlName="model" placeholder="e.g. Camry" />
                <mat-hint>Model name or trim</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>event</mat-icon>
                <mat-label>Year</mat-label>
                <input matInput type="number" formControlName="year" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>confirmation_number</mat-icon>
                <mat-label>License Plate</mat-label>
                <input matInput formControlName="license_plate" placeholder="AB1234" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>palette</mat-icon>
                <mat-label>Color</mat-label>
                <input matInput formControlName="color" placeholder="e.g. Blue" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>category</mat-icon>
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="economy">Economy</mat-option>
                  <mat-option value="midsize">Midsize</mat-option>
                  <mat-option value="suv">SUV</mat-option>
                  <mat-option value="luxury">Luxury</mat-option>
                  <mat-option value="truck">Truck</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>settings</mat-icon>
                <mat-label>Transmission</mat-label>
                <mat-select formControlName="transmission">
                  <mat-option value="automatic">Automatic</mat-option>
                  <mat-option value="manual">Manual</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>local_gas_station</mat-icon>
                <mat-label>Fuel Type</mat-label>
                <mat-select formControlName="fuel_type">
                  <mat-option value="gasoline">Gasoline</mat-option>
                  <mat-option value="diesel">Diesel</mat-option>
                  <mat-option value="electric">Electric</mat-option>
                  <mat-option value="hybrid">Hybrid</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>airline_seat_recline_normal</mat-icon>
                <mat-label>Seats</mat-label>
                <input matInput type="number" formControlName="seats" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="fancy">
                <mat-icon matPrefix>attach_money</mat-icon>
                <mat-label>Daily Rate</mat-label>
                <input matInput type="number" formControlName="daily_rate" step="0.01" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width fancy">
                <mat-icon matPrefix>list</mat-icon>
                <mat-label>Features</mat-label>
                <input matInput formControlName="features" placeholder="Bluetooth, Backup Camera" />
                <mat-hint>Comma-separated features</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width fancy">
                <mat-icon matPrefix>image</mat-icon>
                <mat-label>Image URL</mat-label>
                <input matInput formControlName="image_url" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width fancy">
                <mat-icon matPrefix>place</mat-icon>
                <mat-label>Location</mat-label>
                <input matInput formControlName="location" placeholder="City / Branch" />
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-flat-button class="primary" type="submit" [disabled]="form.invalid || saving">Add Vehicle</button>
              <button mat-button type="button" (click)="cancel()">Cancel</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .vehicle-add { padding:28px; max-width:980px; margin:0 auto; }
    mat-card { border-radius:18px; padding:18px; background: linear-gradient(180deg,#ffffff,#f6fbff); box-shadow: 0 18px 60px rgba(8,30,70,0.06); }
    mat-card-title { font-size:1.4rem; font-weight:800; color:#102a43; margin-bottom:8px; }
    .grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:14px; }
    .full-width { grid-column: 1 / -1; }

    /* Fancy form-field styling */
    .fancy .mat-form-field-flex { background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(245,250,255,0.6)); border-radius:12px; padding:6px 10px; }
    .fancy .mat-form-field-infix { padding:6px 0; }
    .fancy mat-icon { color:#1565c0; margin-right:8px; }
    .mat-form-field.mat-focused .mat-form-field-flex { box-shadow: 0 12px 30px rgba(0,118,255,0.14); transform: translateY(-3px); }
    .mat-form-field { width:100%; }

    .actions { display:flex; gap:12px; justify-content:flex-end; margin-top:18px; }
    button.primary { background: linear-gradient(90deg,#00c6ff,#0072ff); color:#fff; box-shadow:0 12px 36px rgba(0,114,255,0.16); }
    button.mat-button { color:#475569; }

    @media (max-width:900px) { .grid { grid-template-columns: 1fr; } }
    `
  ]
})
export class AdminVehicleAddComponent {
  form: any;

  saving = false;

  constructor(private fb: FormBuilder, private carSvc: CarService, private router: Router) {
    this.form = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      license_plate: ['', Validators.required],
      color: ['', Validators.required],
      category: ['midsize', Validators.required],
      transmission: ['automatic', Validators.required],
      fuel_type: ['gasoline', Validators.required],
      seats: [4, [Validators.required, Validators.min(1)]],
      daily_rate: [0, [Validators.required, Validators.min(0)]],
      features: [''],
      image_url: [''],
      location: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.value as any;
    const payload = {
      make: String(raw.make || ''),
      model: String(raw.model || ''),
      year: Number(raw.year || new Date().getFullYear()),
      license_plate: String(raw.license_plate || ''),
      color: String(raw.color || ''),
      category: String(raw.category || 'midsize'),
      transmission: String(raw.transmission || 'automatic'),
      fuel_type: String(raw.fuel_type || 'gasoline'),
      seats: Number(raw.seats || 4),
      daily_rate: Number(raw.daily_rate || 0),
      features: raw.features ? String(raw.features).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      image_url: raw.image_url ? String(raw.image_url) : undefined,
      location: raw.location ? String(raw.location) : undefined
    } as any;

    this.carSvc.createCar(payload).subscribe({
      next: () => { this.saving = false; this.router.navigate(['/admin/vehicles']); },
      error: (e) => { console.error(e); this.saving = false; }
    });
  }

  cancel() { this.router.navigate(['/admin/vehicles']); }
}
