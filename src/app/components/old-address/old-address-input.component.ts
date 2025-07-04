// src/app/components/old-address/old-address-input.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OldProvinceAddress, OldDistrictAddress, OldWardAddress } from '../../models/address.model';
import { OldProvinceAutocompleteComponent } from './old-province/old-province-input.component';
import { OldDistrictAutocompleteComponent } from './old-district/old-district-input.component';
import { FormControl } from '@angular/forms';
import { OldWardAutocompleteComponent } from './old-ward/old-ward-input.component';

@Component({
  selector: 'app-old-address-input',
  standalone: true,
  imports: [
    CommonModule,
    OldProvinceAutocompleteComponent,
    OldDistrictAutocompleteComponent,
    OldWardAutocompleteComponent
  ],
  templateUrl: './old-address-input.component.html',
  styleUrls: ['./old-address-input.component.css']
})
export class OldAddressInputComponent {
  @Input() provinces: OldProvinceAddress[] = [];
  @Input() provincesControl!: FormControl;

  @Input() districts: OldDistrictAddress[] = [];
  @Input() districtsControl!: FormControl;

  @Input() wards: OldWardAddress[] = [];
  @Input() wardsControl!: FormControl;

  @Output() provinceSelected = new EventEmitter<OldProvinceAddress>();
  @Output() provinceCleared = new EventEmitter<void>();

  @Output() districtSelected = new EventEmitter<OldDistrictAddress>();
  @Output() districtCleared = new EventEmitter<void>();

  @Output() wardSelected = new EventEmitter<OldWardAddress>();
  @Output() wardCleared = new EventEmitter<void>();

  onProvinceSelected(province: OldProvinceAddress) {
    this.provinceSelected.emit(province);
  }

  onDistrictSelected(district: OldDistrictAddress) {
    this.districtSelected.emit(district);
  }

  onWardSelected(ward: OldWardAddress) {
    this.wardSelected.emit(ward);
  }
}
