// src/app/components/address-mapping/address-mapping.component.ts
import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { AddressOld, AddressNew, NewProvinceAddress, OldProvinceAddress, OldDistrictAddress, OldWardAddress, NewWardAddress } from '../../models/address.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-address-mapping',
    standalone: true,
    templateUrl: './address-mapping.component.html',
    styleUrls: ['./address-mapping.component.css'],
    imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, MatCardModule],
})
export class AddressMappingComponent implements OnInit {
    newProvince: NewProvinceAddress[] = [];
    newWards: NewWardAddress[] = [];

    oldProvince: OldProvinceAddress[] = [];
    oldDistricts: OldDistrictAddress[] = [];
    oldWards: OldWardAddress[] = [];

    selectedProvinceID: string = '';
    selectedWardID: string = '';

    listOldProvince: OldProvinceAddress[] = [];
    listOldDistrict: OldDistrictAddress[] = [];
    listOldWard: OldWardAddress[] = [];

    listNewProvince: NewProvinceAddress[] = [];
    listNewWard: NewWardAddress[] = [];

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
        const mapping = this.newProvince.find(np =>
            np.mergeProvince.includes(oldProvinceID)
        );
        console.log('oldProvinceID', oldProvinceID);
        console.log("mapping", mapping);

        if (mapping) {
            this.selectedProvinceID = mapping.newProvinceID || '';
            console.log("selectedProvinceID", this.selectedProvinceID);
        }
        this.listOldDistrict = [
            ...new Set(
                this.oldDistricts.
                    filter(a => a.oldProvinceID === oldProvinceID)
            )
        ];
        this.listOldWard = [];

        this.selectedWardID = '';
        this.listNewWard = [
            ...new Set(
                this.newWards.
                    filter(a => a.newProvinceID === this.selectedProvinceID)
            )
        ];
    }

    onOldDistrictChange(oldDistrictID: string) {
        this.listOldWard = this.oldWards
            .filter(a => a.oldDistrictID === oldDistrictID)
    }

    onOldWardChange(ward: string) {
        console.log("ward", ward);
        const mapping = this.newWards.find(nw =>
            nw.mergeWard.includes(ward)
        );
        console.log("mapping", mapping);

        if (mapping) {
            this.selectedWardID = mapping.newWardID || '';
            console.log(this.selectedWardID);
        }
    }

    onNewProvinceChange(newProvinceID: string) {
        // Tìm trong danh sách newProvince để lấy danh sách các tỉnh cũ đã sáp nhập
        const mapping = this.newProvince.find(p => p.newProvinceID === newProvinceID);

        if (mapping) {
            // Lọc các tỉnh cũ từ danh sách full theo các mã mergeProvince
            this.listOldProvince = this.oldProvince.filter(p =>
                mapping.mergeProvince.includes(p.oldProvinceID)
            );
        } else {
            this.listOldProvince = [];
        }
        // Tạm thời chưa chọn huyện, đợi người dùng chọn tỉnh
        this.listOldDistrict = [];
        this.listOldWard = [];

        // Cập nhật dữ liệu dropdown phường/xã mới
        this.listNewWard = [
            ...new Set(
                this.newWards
                    .filter(a => a.newProvinceID === newProvinceID)
            )
        ];
    }

    onNewWardChange() {
        this.listOldDistrict = []   
        this.listOldWard = []
    }
}