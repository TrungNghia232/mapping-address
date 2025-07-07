// src/app/components/new-address/new-address-input.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NewProvinceAddress, NewWardAddress } from '@models/address.model';
import { NewProvinceAutocompleteComponent } from './new-province/new-province-input.component';
import { NewWardAutocompleteComponent } from './new-ward/new-ward-input.component';
// import { NewWardInputComponent } from './new-ward/new-ward-input.component';

@Component({
  selector: 'app-new-address-input',
  standalone: true,
  imports: [
    CommonModule,
    NewProvinceAutocompleteComponent,
    NewWardAutocompleteComponent
  ],
  templateUrl: './new-address-input.component.html',
  styleUrls: ['./new-address-input.component.css', ]
})
export class NewAddressInputComponent {
  @Input() provinces: NewProvinceAddress[] = [];
  @Input() provinceControl!: FormControl<NewProvinceAddress | null>;

  @Input() wards: NewWardAddress[] = [];
  @Input() wardControl!: FormControl<NewWardAddress | null>;

  @Output() provinceSelected = new EventEmitter<NewProvinceAddress>();
  @Output() provinceCleared = new EventEmitter<void>();

  @Output() wardSelected = new EventEmitter<NewWardAddress>();
  @Output() wardCleared = new EventEmitter<void>();

  onProvinceSelected(province: NewProvinceAddress) {
    this.provinceSelected.emit(province);
  }

  onWardSelected(ward: NewWardAddress) {
    this.wardSelected.emit(ward);
  }
}
