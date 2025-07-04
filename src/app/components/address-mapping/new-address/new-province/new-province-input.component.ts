// src/app/components/new-address/new-province/new-province-input.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NewProvinceAddress } from '@models/address.model';
import { MATERIAL_AUTOCOMPLETE_IMPORTS } from '@shared/material/autocomplete';

@Component({
  selector: 'app-new-province-input',
  templateUrl: './new-province-input.component.html',
  styleUrls: [
    './new-province-input.component.css',
    '../../address-mapping.component.css',
  ],
  imports: [...MATERIAL_AUTOCOMPLETE_IMPORTS],
})
export class NewProvinceAutocompleteComponent implements OnInit {
  @Input() provinces: NewProvinceAddress[] = [];
  @Input() provinceControl!: FormControl

  @Output() provinceSelected = new EventEmitter<NewProvinceAddress>();
  @Output() clearClicked = new EventEmitter<void>();

  filteredProvinces: NewProvinceAddress[] = [];

  ngOnInit(): void {
    this.provinceControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(value => {
          const inputValue = typeof value === 'string' ? value : value?.newProvinceName ?? '';
          return this._filterProvinces(inputValue);
        })
      )
      .subscribe(filtered => {
        this.filteredProvinces = filtered;
      });
  }


  displayFn = (province: NewProvinceAddress | string): string =>
          typeof province === 'string' ? province : province?.newProvinceName;

  private _filterProvinces(value: string): NewProvinceAddress[] {
    const filterValue = value.toLowerCase();
    return this.provinces.filter(p => p.newProvinceName.toLowerCase().includes(filterValue));
  }

  onSelected(province: NewProvinceAddress): void {
    this.provinceSelected.emit(province);
    this.provinceControl.setValue(province.newProvinceName, { emitEvent: false }); // emitEvent: false to prevent re-triggering valueChanges immediately
  }

  clearSelection(): void {
    this.provinceControl.setValue('');
    this.clearClicked.emit(); // 🔥 báo cho component cha biết
  }
}
