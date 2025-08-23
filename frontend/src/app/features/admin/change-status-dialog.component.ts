import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-change-status-dialog',
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Change Booking Status</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="selected">
          <mat-option *ngFor="let s of data.statuses" [value]="s">{{s | titlecase}}</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">Save</button>
    </mat-dialog-actions>
  `
})
export class ChangeStatusDialogComponent {
  selected: string;
  constructor(public dialogRef: MatDialogRef<ChangeStatusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selected = data?.current || (data?.statuses && data.statuses[0]) || '';
  }
  save() { this.dialogRef.close(this.selected); }
  close() { this.dialogRef.close(undefined); }
}
