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

    // Default value 
    oldProvinceDefautControl: OldProvinceAddress = {
        oldProvinceID: '',
        oldProvinceName: ''
    }
    oldDistrictDefautControl: OldDistrictAddress = {
        oldDistrictID: '',
        oldDistrictName: '',
        oldProvinceID: ''
    }
    oldWardDefautControl: OldWardAddress = {
        oldWardID: '',
        oldWardName: '',
        oldDistrictID: ''
    }
    newProvinceDefautControl: NewProvinceAddress = {
        newProvinceID: '',
        newProvinceName: '',
        mergeProvince: []
    }
    newWardDefautControl: NewWardAddress = {
        newWardID: '',
        newWardName: '',
        mergeWard: [],
        newProvinceID: ''
    }
    // Form Controls for Autocomplete inputs
    oldProvinceControl = new FormControl<OldProvinceAddress>(this.oldProvinceDefautControl);
    oldDistrictControl = new FormControl<OldDistrictAddress>(this.oldDistrictDefautControl);
    oldWardControl = new FormControl<OldWardAddress>(this.oldWardDefautControl);

    newProvinceControl = new FormControl<NewProvinceAddress>(this.newProvinceDefautControl);
    newWardControl = new FormControl<NewWardAddress>(this.newWardDefautControl);


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

    onOldProvinceSelected(selected: OldProvinceAddress) {
        this.oldProvinceControl.setValue(selected);
        const mapping = this.newProvince.find(np =>
            np.mergeProvince.includes(selected.oldProvinceID)
        );
        console.log('oldProvinceID', selected.oldProvinceID);
        console.log("mapping", mapping);

        if (mapping) {
            this.newProvinceControl.setValue(mapping || this.newProvinceDefautControl);
            console.log("new province selected: ", this.newProvinceControl.value);
        }
        this.listOldDistrict = [
            ...new Set(
                this.oldDistricts.
                    filter(a => a.oldProvinceID === selected.oldProvinceID)
            )
        ];
        console.log("listOldDistrict", this.listOldDistrict);
        // Clear formControl huyện cũ
        this.oldDistrictControl.setValue(this.oldDistrictDefautControl);
        this.listOldWard = [];

        this.newWardControl.setValue(this.newWardDefautControl);
        this.listNewWard = [
            ...new Set(
                this.newWards.
                    filter(a => a.newProvinceID === mapping?.newProvinceID)
            )
        ];
        console.log("listNewWard", this.listNewWard);
    }

    onOldDistrictSelected(selected: OldDistrictAddress) {
        this.oldDistrictControl.setValue(selected);
        this.listOldWard = this.oldWards
            .filter(a => a.oldDistrictID === selected.oldDistrictID)
    }

    onOldWardSelected(selected: OldWardAddress) {
        console.log("ward", selected.oldWardID);
        const mapping = this.newWards.find(nw =>
            nw.mergeWard.includes(selected.oldWardID)
        );
        console.log("mapping", mapping);

        if (mapping) {
            this.newWardControl.setValue(mapping || this.newWardDefautControl)
            console.log(this.newWardControl.value);
        }
    }

    onNewProvinceSelected(selected: NewProvinceAddress) {
        // Tìm tỉnh mới được chọn
        const mapping = this.newProvince.find(p => p.newProvinceID === selected.newProvinceID);

        if (mapping) {
            // Lấy danh sách các tỉnh cũ được sáp nhập vào tỉnh mới
            const mergedOldProvinces = this.oldProvince.filter(p =>
                mapping.mergeProvince.includes(p.oldProvinceID)
            );

            console.log("mergedOldProvinces", mergedOldProvinces);
            this.listOldProvince = mergedOldProvinces;

            // ✅ Nếu chỉ có 1 tỉnh cũ → chọn luôn
            if (mergedOldProvinces.length === 1) {
                this.oldProvinceControl.setValue(mergedOldProvinces[0]);

                // Lọc huyện cũ theo tỉnh cũ đó
                this.listOldDistrict = this.oldDistricts.filter(d =>
                    d.oldProvinceID === this.oldProvinceControl.value?.oldProvinceID
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
            w.newProvinceID === selected.newProvinceID
        );
    }

    onNewWardSelected(selected: NewWardAddress) {
        // Tìm thông tin phường/xã mới được chọn
        const mapping = this.newWards.find(nw => nw.newWardID === selected.newWardID);
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
            const district = this.oldDistricts.find(d => d.oldDistrictID === districtIDs[0]);
            if (district) {
                this.listOldDistrict = this.oldDistricts.filter(d => d.oldDistrictID === districtIDs[0]);
                console.log("listOldDistrict", this.listOldDistrict);
                this.oldDistrictControl.setValue(district);
                this.listOldWard = mergedOldWards;

                // 🔁 Tìm tỉnh chứa huyện này
                const province = this.oldProvince.find(p => p.oldProvinceID === district.oldProvinceID);
                this.oldProvinceControl.setValue(province || this.oldProvinceDefautControl)
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
        // Xóa dữ liệu địa chỉ cũ
        this.oldProvinceControl.setValue(this.oldProvinceDefautControl);
        this.oldDistrictControl.setValue(this.oldDistrictDefautControl);
        this.oldWardControl.setValue(this.oldWardDefautControl);

        this.listOldProvince = this.oldProvince;
        this.listOldDistrict = [];
        this.listOldWard = [];

        // Xóa dữ liệu địa chỉ mới
        this.newProvinceControl.setValue(this.newProvinceDefautControl);
        this.newWardControl.setValue(this.newWardDefautControl);
        this.listNewWard = [];
    }

    onOldDistrictCleared(): void {
        this.oldDistrictControl.setValue(this.oldDistrictDefautControl);
        this.oldWardControl.setValue(this.oldWardDefautControl);
        this.listOldWard = [];

        this.newWardControl.setValue(this.newWardDefautControl);
    }

    onOldWardCleared(): void {
        this.oldWardControl.setValue(this.oldWardDefautControl);
        this.newWardControl.setValue(this.newWardDefautControl);
        this.listNewWard = [];
    }

    onNewProvinceCleared(): void {
        this.newProvinceControl.setValue(this.newProvinceDefautControl);
        this.newWardControl.setValue(this.newWardDefautControl);

        this.oldProvinceControl.setValue(this.oldProvinceDefautControl);
        this.oldDistrictControl.setValue(this.oldDistrictDefautControl);
        this.oldWardControl.setValue(this.oldWardDefautControl);

        this.listOldProvince = this.oldProvince;
        this.listOldDistrict = [];
        this.listOldWard = [];
        this.listNewWard = [];
    }

    onNewWardCleared(): void {
        this.newWardControl.setValue(this.newWardDefautControl);

        this.oldDistrictControl.setValue(this.oldDistrictDefautControl);
        this.listOldDistrict = this.oldDistricts.filter(d => d.oldProvinceID === this.oldProvinceControl.value?.oldProvinceID);
        this.oldWardControl.setValue(this.oldWardDefautControl);
        this.listOldWard = [];
    }
}