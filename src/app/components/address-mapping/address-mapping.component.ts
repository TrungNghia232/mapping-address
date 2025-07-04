// src/app/components/address-mapping/address-mapping.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NewProvinceAddress, NewWardAddress, OldDistrictAddress, OldProvinceAddress, OldWardAddress } from '@models/address.model';
import { AddressService } from '@services/address.service';
import { Observable } from 'rxjs';
import { OldAddressInputComponent } from './old-address/old-address-input.component';
import { NewAddressInputComponent } from './new-address/new-address-input.component';

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
        OldAddressInputComponent,
        NewAddressInputComponent
    ],
})
export class AddressMappingComponent implements OnInit {
    newProvince: NewProvinceAddress[] = [];
    newWards: NewWardAddress[] = [];

    oldProvince: OldProvinceAddress[] = [];
    oldDistricts: OldDistrictAddress[] = [];
    oldWards: OldWardAddress[] = [];

    listOldProvince: OldProvinceAddress[] = [];
    listOldDistrict: OldDistrictAddress[] = [];
    listOldWard: OldWardAddress[] = [];

    listNewProvince: NewProvinceAddress[] = [];
    listNewWard: NewWardAddress[] = [];

    // Form Controls for Autocomplete inputs
    oldProvinceControl = new FormControl('');
    oldDistrictControl = new FormControl('');
    oldWardControl = new FormControl('');

    newProvinceControl = new FormControl('');
    newWardControl = new FormControl('');


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
            this.newProvinceControl.setValue(mapping.newProvinceName || '');
            console.log("new province selected: ", this.newProvinceControl.value);
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

        this.newWardControl.setValue('');
        this.listNewWard = [
            ...new Set(
                this.newWards.
                    filter(a => a.newProvinceID === this.newProvinceControl.value)
            )
        ];
    }

    onOldDistrictChange(oldDistrictID: string) {
        this.oldDistrictControl.setValue(oldDistrictID);
        console.log("oldDistrictID", oldDistrictID);
        this.listOldWard = this.oldWards
            .filter(a => a.oldDistrictID === oldDistrictID)
        console.log("listOldWard", this.listOldWard);
    }

    onOldWardChange(ward: string) {
        console.log("ward", ward);
        const mapping = this.newWards.find(nw =>
            nw.mergeWard.includes(ward)
        );
        console.log("mapping", mapping);

        if (mapping) {
            this.newWardControl.setValue(mapping.newWardName || '')
            console.log(this.newWardControl.value);
        }
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
                const provinceName = district.oldDistrictName;
                this.oldProvinceControl.setValue(provinceName || '')
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

    onOldProvinceCleared(): void {
        this.oldProvinceControl.setValue('');
        this.oldDistrictControl.setValue('');
        this.oldWardControl.setValue('');

        this.listOldDistrict = [];
        this.listOldWard = [];
        this.newProvinceControl.setValue('');
        this.newWardControl.setValue('');
        this.listNewWard = [];
    }

    onOldDistrictCleared(): void {
        this.oldDistrictControl.setValue('');
        this.oldWardControl.setValue('');
        this.listOldWard = [];
        this.newWardControl.setValue('');
        this.listNewWard = [];
    }

    onOldWardCleared(): void {
        this.oldWardControl.setValue('');
        this.newWardControl.setValue('');
        this.listNewWard = [];
    }

    onNewProvinceCleared(): void {
        this.newProvinceControl.setValue('');
        this.newWardControl.setValue('');

        this.oldProvinceControl.setValue('');
        this.oldDistrictControl.setValue('');
        this.oldWardControl.setValue('');

        this.listNewWard = [];
    }

    onNewWardCleared(): void {
        this.newWardControl.setValue('');
        this.listOldWard = [];
    }
}