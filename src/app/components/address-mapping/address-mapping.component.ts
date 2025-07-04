// src/app/components/address-mapping/address-mapping.component.ts
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input'
import { NewProvinceAddress, NewWardAddress, OldDistrictAddress, OldProvinceAddress, OldWardAddress } from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { map, Observable, startWith } from 'rxjs';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OldAddressInputComponent } from '../old-address/old-address-input.component';

@Component({
    selector: 'app-address-mapping',
    standalone: true,
    templateUrl: './address-mapping.component.html',
    styleUrls: ['./address-mapping.component.css'],
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatCardModule,
        MatAutocompleteModule,
        MatInputModule,
        OldAddressInputComponent
    ],
})
export class AddressMappingComponent implements OnInit {
    newProvince: NewProvinceAddress[] = [];
    newWards: NewWardAddress[] = [];

    oldProvince: OldProvinceAddress[] = [];
    oldDistricts: OldDistrictAddress[] = [];
    oldWards: OldWardAddress[] = [];

    selectedNewProvinceID: string = '';
    selectedNewWardID: string = '';

    listOldProvince: OldProvinceAddress[] = [];
    listOldDistrict: OldDistrictAddress[] = [];
    listOldWard: OldWardAddress[] = [];

    listNewProvince: NewProvinceAddress[] = [];
    listNewWard: NewWardAddress[] = [];

    // Form Controls for Autocomplete inputs
    oldProvinceControl = new FormControl('');
    oldDistrictControl = new FormControl('');
    oldWardControl = new FormControl('');

    // Danh sách tìm kiếm
    filteredOldProvinces!: Observable<OldProvinceAddress[]>;

    constructor(private addressService: AddressService) { }

    ngOnInit(): void {
        this.addressService.getNewProvince().subscribe(data => {
            this.newProvince = data;
            this.listNewProvince = data;
        });
        this.addressService.getNewWards().subscribe(data => {
            this.newWards = data;
        });
        this.addressService.getOldProvince().subscribe(data => {
            this.oldProvince = data;
            this.listOldProvince = data;
        });
        this.addressService.getOldDistrict().subscribe(data => {
            this.oldDistricts = data;
        });
        this.addressService.getOldWard().subscribe(data => {
            this.oldWards = data;
        });
    }

    onOldProvinceChange(oldProvinceID: string) {
        this.oldProvinceControl.setValue(oldProvinceID);
        const mapping = this.newProvince.find(np =>
            np.mergeProvince.includes(oldProvinceID)
        );
        console.log('oldProvinceID', oldProvinceID);
        console.log("mapping", mapping);

        if (mapping) {
            this.selectedNewProvinceID = mapping.newProvinceID || '';
            console.log("selectedNewProvinceID", this.selectedNewProvinceID);
        }
        this.listOldDistrict = [
            ...new Set(
                this.oldDistricts.
                    filter(a => a.oldProvinceID === oldProvinceID)
            )
        ];
        console.log("listOldDistrict", this.listOldDistrict);
        // Clear formControl huyện cũ
        this.oldDistrictControl.setValue('');
        this.listOldWard = [];

        this.oldDistrictControl.setValue('');
        this.selectedNewWardID = '';
        this.listNewWard = [
            ...new Set(
                this.newWards.
                    filter(a => a.newProvinceID === this.selectedNewProvinceID)
            )
        ];
    }

    onOldProvinceCleared(): void {
        this.oldProvinceControl.setValue('');
        this.oldDistrictControl.setValue('');
        this.oldWardControl.setValue('');

        this.listOldDistrict = [];
        this.listOldWard = [];
        this.selectedNewProvinceID = '';
        this.selectedNewWardID = '';
        this.listNewWard = [];
    }

    onOldDistrictChange(oldDistrictID: string) {
        this.oldDistrictControl.setValue(oldDistrictID);
        console.log("oldDistrictID", oldDistrictID);
        this.listOldWard = this.oldWards
            .filter(a => a.oldDistrictID === oldDistrictID)
        console.log("listOldWard", this.listOldWard);
    }

    onOldDistrictCleared(): void {
        this.oldDistrictControl.setValue('');
        this.oldWardControl.setValue('');
        this.listOldWard = [];
        this.selectedNewWardID = '';
        this.listNewWard = [];
    }

    onOldWardChange(ward: string) {
        console.log("ward", ward);
        const mapping = this.newWards.find(nw =>
            nw.mergeWard.includes(ward)
        );
        console.log("mapping", mapping);

        if (mapping) {
            this.selectedNewWardID = mapping.newWardID || '';
            console.log(this.selectedNewWardID);
        }
    }

    onOldWardCleared(): void {
        this.oldWardControl.setValue('');
        this.selectedNewWardID = '';
        this.listNewWard = [];
    }

    onNewProvinceChange(newProvinceID: string) {
        // Tìm tỉnh mới được chọn
        const mapping = this.newProvince.find(p => p.newProvinceID === newProvinceID);

        if (mapping) {
            // Lấy danh sách các tỉnh cũ được sáp nhập vào tỉnh mới
            const mergedOldProvinces = this.oldProvince.filter(p =>
                mapping.mergeProvince.includes(p.oldProvinceID)
            );
            this.listOldProvince = mergedOldProvinces;

            // ✅ Nếu chỉ có 1 tỉnh cũ → chọn luôn
            if (mergedOldProvinces.length === 1) {
                this.oldProvinceControl.setValue(mergedOldProvinces[0].oldProvinceID);

                // Lọc huyện cũ theo tỉnh cũ đó
                this.listOldDistrict = this.oldDistricts.filter(d =>
                    d.oldProvinceID === this.oldProvinceControl.value
                );

            } else {
                this.listOldDistrict = [];
            }

        } else {
            this.listOldProvince = [];
            this.listOldDistrict = [];
        }

        this.listOldWard = [];

        // Cập nhật dữ liệu dropdown phường/xã mới thuộc tỉnh mới
        this.listNewWard = this.newWards.filter(w =>
            w.newProvinceID === newProvinceID
        );
    }


    onNewWardChange(newWardID: string) {
        // Tìm thông tin phường/xã mới được chọn
        const mapping = this.newWards.find(nw => nw.newWardID === newWardID);
        if (!mapping) {
            this.listOldDistrict = [];
            this.listOldWard = [];
            return;
        }
        console.log("mapping", mapping);

        const mergedOldWardIDs = mapping.mergeWard;
        console.log("mergedOldWardIDs", mergedOldWardIDs);

        // Lọc ra các phường/xã cũ từ mergeWard
        const mergedOldWards = this.oldWards.filter(ward =>
            mergedOldWardIDs.includes(ward.oldWardID)
        );
        console.log("mergedOldWards", mergedOldWards);

        // Lấy danh sách các huyện từ các xã cũ
        const districtIDs = Array.from(
            new Set(mergedOldWards.map(w => w.oldDistrictID))
        );
        console.log("districtIDs", districtIDs);

        if (districtIDs.length === 1) {
            // Nếu chỉ có 1 huyện → chọn luôn
            this.oldDistrictControl.setValue(districtIDs[0]);
            this.listOldDistrict = this.oldDistricts.filter(d => d.oldDistrictID === this.oldDistrictControl.value);

            this.listOldWard = mergedOldWards;

            // 🔁 Tìm tỉnh chứa huyện này
            const district = this.oldDistricts.find(d => d.oldDistrictID === this.oldDistrictControl.value);
            if (district) {
                const provinceID = district.oldProvinceID;
                this.oldProvinceControl.setValue(provinceID || '')
            }
        } else {
            // Nếu nhiều huyện → cho người dùng chọn từ danh sách huyện có liên quan
            this.listOldDistrict = this.oldDistricts.filter(d =>
                districtIDs.includes(d.oldDistrictID)
            );

            // Xóa danh sách xã → chờ người dùng chọn huyện
            this.listOldWard = [];
        }
    }
}