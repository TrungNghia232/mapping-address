// src/app/components/old-address/old-district/old-district-input.component.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { OldDistrictAddress } from '../../../models/address.model';
import { MATERIAL_AUTOCOMPLETE_IMPORTS } from '../../../shared/material/autocomplete';


@Component({
    selector: 'app-old-district-input',
    standalone: true,
    templateUrl: './old-district-input.component.html',
    styleUrls: [
        './old-district-input.component.css',
        '../old-address-input.component.css'
    ],
    imports: [...MATERIAL_AUTOCOMPLETE_IMPORTS],
})
export class OldDistrictAutocompleteComponent implements OnInit {
    @Input() districts: OldDistrictAddress[] = [];
    @Input() districtsControl!: FormControl

    @Output() districtSelected = new EventEmitter<OldDistrictAddress>();
    @Output() clearClicked = new EventEmitter<void>();

    filteredDistricts: OldDistrictAddress[] = [];

    ngOnInit(): void {
        this.districtsControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(value => {
                    const inputValue = typeof value === 'string' ? value : value?.oldDistrictName ?? '';
                    return this._filterDistricts(inputValue);
                })
            )
            .subscribe(filtered => {
                this.filteredDistricts = filtered;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['districts']) {
            // Nếu chưa có gì nhập thì hiển thị toàn bộ danh sách huyện
            const controlValue = this.districtsControl.value;
            const keyword = typeof controlValue === 'string' ? controlValue : controlValue?.oldDistrictName ?? '';
            this.filteredDistricts = this._filterDistricts(keyword);
        }
    }

    displayFn = (district: OldDistrictAddress | string): string =>
        typeof district === 'string' ? district : district?.oldDistrictName;

    private _filterDistricts(value: string): OldDistrictAddress[] {
        const filterValue = value.toLowerCase();
        return this.districts.filter(d => d.oldDistrictName.toLowerCase().includes(filterValue));
    }

    onSelected(district: OldDistrictAddress): void {
        this.districtSelected.emit(district);
        this.districtsControl.setValue(district.oldDistrictName, { emitEvent: false }); // emitEvent: false to prevent re-triggering valueChanges immediately
    }

    clearSelection(): void {
        this.districtsControl.setValue('');
        this.clearClicked.emit(); // 🔥 báo cho component cha biết
    }
}
