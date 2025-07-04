// src/app/components/old-address/old-province/old-province-input.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OldProvinceAddress } from '../../../models/address.model';
import { MATERIAL_AUTOCOMPLETE_IMPORTS } from '../../../shared/material/autocomplete';


@Component({
  selector: 'app-old-province-input',
  templateUrl: './old-province-input.component.html',
  styleUrls: [
    './old-province-input.component.css',
    '../old-address-input.component.css'
  ],
  imports: [...MATERIAL_AUTOCOMPLETE_IMPORTS],
})
export class OldProvinceAutocompleteComponent implements OnInit {
  @Input() provinces: OldProvinceAddress[] = [];
  @Input() provincesControl!: FormControl

  @Output() provinceSelected = new EventEmitter<OldProvinceAddress>();
  @Output() clearClicked = new EventEmitter<void>();

  provinceControl = new FormControl<string | OldProvinceAddress>('');
  filteredProvinces: OldProvinceAddress[] = [];

  ngOnInit(): void {
    this.provinceControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(value => {
          const inputValue = typeof value === 'string' ? value : value?.oldProvinceName ?? '';
          return this._filterProvinces(inputValue);
        })
      )
      .subscribe(filtered => {
        this.filteredProvinces = filtered;
      });
  }


  displayFn = (province: OldProvinceAddress | string): string =>
    typeof province === 'string' ? province : province?.oldProvinceName;

  private _filterProvinces(value: string): OldProvinceAddress[] {
    const filterValue = value.toLowerCase();
    return this.provinces.filter(p => p.oldProvinceName.toLowerCase().includes(filterValue));
  }

  onSelected(province: OldProvinceAddress): void {
    this.provinceSelected.emit(province);
    this.provinceControl.setValue(province.oldProvinceName, { emitEvent: false }); // emitEvent: false to prevent re-triggering valueChanges immediately
  }

  clearSelection(): void {
    this.provinceControl.setValue('');
    this.clearClicked.emit(); // 🔥 báo cho component cha biết
  }
}
