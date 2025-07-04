// src/app/components/old-address/old-ward/old-ward-input.component.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { OldWardAddress } from '@models/address.model';
import { MATERIAL_AUTOCOMPLETE_IMPORTS } from '@shared/material/autocomplete';


@Component({
    selector: 'app-old-ward-input',
    standalone: true,
    templateUrl: './old-ward-input.component.html',
    styleUrls: [
        './old-ward-input.component.css',
        '../old-address-input.component.css',
        '../../address-mapping.component.css',
    ],
    imports: [...MATERIAL_AUTOCOMPLETE_IMPORTS],
})
export class OldWardAutocompleteComponent implements OnInit {
    @Input() wards: OldWardAddress[] = [];
    @Input() wardControl!: FormControl

    @Output() wardSelected = new EventEmitter<OldWardAddress>();
    @Output() clearClicked = new EventEmitter<void>();

    filteredWards: OldWardAddress[] = [];

    ngOnInit(): void {
        this.wardControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(value => {
                    const inputValue = typeof value === 'string' ? value : value?.oldWardName ?? '';
                    return this._filterWards(inputValue);
                })
            )
            .subscribe(filtered => {
                this.filteredWards = filtered;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['wards']) {
            // Nếu chưa có gì nhập thì hiển thị toàn bộ danh sách huyện
            const controlValue = this.wardControl.value;
            const keyword = typeof controlValue === 'string' ? controlValue : controlValue?.oldWardName ?? '';
            this.filteredWards = this._filterWards(keyword);
        }
    }

    displayFn = (ward: OldWardAddress | string): string =>
        typeof ward === 'string' ? ward : ward?.oldWardName;

    private _filterWards(value: string): OldWardAddress[] {
        const filterValue = value.toLowerCase();
        return this.wards.filter(d => d.oldWardName.toLowerCase().includes(filterValue));
    }

    onSelected(ward: OldWardAddress): void {
        this.wardSelected.emit(ward);
        this.wardControl.setValue(ward.oldWardName, { emitEvent: false }); // emitEvent: false to prevent re-triggering valueChanges immediately
    }

    clearSelection(): void {
        this.wardControl.setValue('');
        this.clearClicked.emit(); // 🔥 báo cho component cha biết
    }
}
