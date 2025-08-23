import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarService, Car } from '../cars/services/car.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-admin-vehicles',
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule],
  template: `
    <div class="admin-vehicles">
      <div class="header">
        <h2>Manage Vehicles</h2>
        <div class="controls">
          <button mat-flat-button color="primary" (click)="loadCars(1)">Refresh</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><mat-spinner diameter="36"></mat-spinner></div>

      <table mat-table [dataSource]="cars" class="mat-elevation-z2" *ngIf="!loading">
        <!-- Make & Model -->
        <ng-container matColumnDef="makeModel">
          <th mat-header-cell *matHeaderCellDef> Vehicle </th>
          <td mat-cell *matCellDef="let c"> <strong>{{c.make}} {{c.model}}</strong><div class="muted">{{c.license_plate}}</div> </td>
        </ng-container>

        <!-- Year -->
        <ng-container matColumnDef="year">
          <th mat-header-cell *matHeaderCellDef> Year </th>
          <td mat-cell *matCellDef="let c"> {{c.year}} </td>
        </ng-container>

        <!-- Category -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef> Category </th>
          <td mat-cell *matCellDef="let c"> {{c.category | titlecase}} </td>
        </ng-container>

        <!-- Rate -->
        <ng-container matColumnDef="daily_rate">
          <th mat-header-cell *matHeaderCellDef> Rate </th>
          <td mat-cell *matCellDef="let c"> {{c.daily_rate | currency}} </td>
        </ng-container>

        <!-- Availability -->
        <ng-container matColumnDef="is_available">
          <th mat-header-cell *matHeaderCellDef> Available </th>
          <td mat-cell *matCellDef="let c">
            <div class="avail-pill" [class.available]="c.is_available" [class.unavailable]="!c.is_available">
              <mat-icon>{{c.is_available ? 'check_circle' : 'cancel'}}</mat-icon>
              <span class="avail-text">{{c.is_available ? 'Available' : 'Unavailable'}}</span>
            </div>
          </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let c" class="actions-cell">
            <button mat-icon-button matTooltip="View" (click)="viewVehicle(c)" class="action view">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Edit" (click)="editVehicle(c)" class="action edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Delete" (click)="deleteVehicle(c)" class="action delete">
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Toggle Availability" (click)="toggleAvailability(c)" class="action toggle" [class.available]="c.is_available">
              <mat-icon>{{c.is_available ? 'toggle_on' : 'toggle_off'}}</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="pagination" *ngIf="pagination.pages > 1">
        <button mat-icon-button (click)="loadCars(pagination.page - 1)" [disabled]="pagination.page === 1"><mat-icon>chevron_left</mat-icon></button>
        <span>Page {{pagination.page}} of {{pagination.pages}}</span>
        <button mat-icon-button (click)="loadCars(pagination.page + 1)" [disabled]="pagination.page === pagination.pages"><mat-icon>chevron_right</mat-icon></button>
      </div>
    </div>
  `,
  styles: [
    `
    .admin-vehicles { padding: 24px; max-width: 1100px; margin: 0 auto; }
    .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    table { width:100%; border-radius:8px; overflow:hidden; }
  th.mat-header-cell { background: linear-gradient(90deg,#f3f6ff,#eef7ff); font-weight:700; }
  td.mat-cell .muted { color:#666; font-size:0.85rem; }
  .pagination{ display:flex; gap:12px; align-items:center; justify-content:center; margin-top:16px; }
  .loading{ display:flex; justify-content:center; padding:24px; }

  /* Action buttons styling */
  .actions-cell { display:flex; gap:8px; align-items:center; }
  .action { width:44px; height:44px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 6px 18px rgba(12,35,64,0.08); transition:transform .12s ease, box-shadow .12s ease; }
  .action.view { background: linear-gradient(90deg,#00c853,#00e676); }
  .action.edit { background: linear-gradient(90deg,#2979ff,#00b0ff); }
  .action.delete { background: linear-gradient(90deg,#ff7043,#ff5252); }
  .action.toggle { background: linear-gradient(90deg,#90a4ae,#cfd8dc); color:#102a43; }
  .action.toggle.available { background: linear-gradient(90deg,#43a047,#66bb6a); color:#fff; }
  .action:hover { transform: translateY(-3px); box-shadow:0 14px 34px rgba(12,35,64,0.12); }
  .action mat-icon { font-size:18px; }
  .avail-pill { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; border-radius:16px; font-weight:700; color:#fff; box-shadow:0 6px 18px rgba(12,35,64,0.06); }
  .avail-pill.available { background: linear-gradient(90deg,#43a047,#66bb6a); }
  .avail-pill.unavailable { background: linear-gradient(90deg,#ef5350,#e53935); }
  .avail-pill mat-icon { font-size:18px; }
    `
  ]
})
export class AdminVehiclesComponent implements OnInit {
  cars: Car[] = [];
  loading = false;
  displayedColumns = ['makeModel','year','category','daily_rate','is_available','actions'];
  pagination = { page: 1, limit: 20, total: 0, pages: 1 };

  constructor(private carSvc: CarService, private router: Router) {}

  ngOnInit(): void { this.loadCars(1); }

  loadCars(page = 1) {
    this.loading = true;
    this.carSvc.getAllCars({ page, limit: this.pagination.limit }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.cars = res.data.cars;
        this.pagination.page = res.data.page;
        this.pagination.limit = this.pagination.limit;
        this.pagination.total = res.data.total;
        this.pagination.pages = res.data.totalPages || 1;
      },
      error: () => { this.loading = false; }
    });
  }

  viewVehicle(c: Car) { this.router.navigate(['/cars', c.id]); }
  editVehicle(c: Car) { this.router.navigate(['/admin/vehicles/edit', c.id]); }

  deleteVehicle(c: Car) {
    if (!confirm(`Delete ${c.make} ${c.model}? This action cannot be undone.`)) return;
    this.carSvc.deleteCar(c.id).subscribe({ next: () => this.loadCars(this.pagination.page), error: (e) => console.error(e) });
  }

  toggleAvailability(c: Car) {
    const newVal = !c.is_available;
    this.carSvc.updateAvailability(c.id, newVal).subscribe({ next: () => this.loadCars(this.pagination.page), error: (e) => console.error(e) });
  }
}
