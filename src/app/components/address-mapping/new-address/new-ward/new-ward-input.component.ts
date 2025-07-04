// src/app/components/new-address/new-ward/new-ward-input.component.ts
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NewWardAddress } from '@models/address.model';
import { MATERIAL_AUTOCOMPLETE_IMPORTS } from '@shared/material/autocomplete';


@Component({
    selector: 'app-new-ward-input',
    standalone: true,
    templateUrl: './new-ward-input.component.html',
    styleUrls: [
        './new-ward-input.component.css',
        '../new-address-input.component.css',
        '../../address-mapping.component.css',
    ],
    imports: [...MATERIAL_AUTOCOMPLETE_IMPORTS],
})
export class NewWardAutocompleteComponent implements OnInit {
    @Input() wards: NewWardAddress[] = [];
    @Input() wardControl!: FormControl

    @Output() wardSelected = new EventEmitter<NewWardAddress>();
    @Output() clearClicked = new EventEmitter<void>();

    filteredWards: NewWardAddress[] = [];

    ngOnInit(): void {
        this.wardControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(200),
                distinctUntilChanged(),
                map(value => {
                    const inputValue = typeof value === 'string' ? value : value?.newWardName ?? '';
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
            const keyword = typeof controlValue === 'string' ? controlValue : controlValue?.newWardName ?? '';
            this.filteredWards = this._filterWards(keyword);
        }
    }

    displayFn = (ward: NewWardAddress | string): string =>
        typeof ward === 'string' ? ward : ward?.newWardName;

    private _filterWards(value: string): NewWardAddress[] {
        const filterValue = value.toLowerCase();
        return this.wards.filter(d => d.newWardName.toLowerCase().includes(filterValue));
    }

    onSelected(ward: NewWardAddress): void {
        this.wardSelected.emit(ward);
        this.wardControl.setValue(ward.newWardName, { emitEvent: false }); // emitEvent: false to prevent re-triggering valueChanges immediately
    }

    clearSelection(): void {
        this.wardControl.setValue('');
        this.clearClicked.emit(); // 🔥 báo cho component cha biết
    }
}
