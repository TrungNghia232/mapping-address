// src/app/components/address-mapping/address-confirm-dialog/address-confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-address-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <!-- <button mat-button (click)="onCancel()">Hủy</button> -->
      <button mat-button (click)="onSaveOnly()" color="accent">Không</button>
      <button mat-button (click)="onConfirm()" color="primary">Có</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px 0;
    }
    mat-dialog-actions {
      padding: 10px 0;
    }
  `]
})
export class AddressConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddressConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onSaveOnly(): void {
    this.dialogRef.close('save');
  }
}