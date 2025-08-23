import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{data?.title || 'Confirm'}}</h2>
    <mat-dialog-content>{{data?.message || 'Are you sure?'}}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">No</button>
      <button mat-flat-button color="warn" (click)="close(true)">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  close(v: boolean) { this.dialogRef.close(v); }
}
