// src/app/components/address-mapping/address-mapping.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NewProvinceAddress, NewWardAddress, OldDistrictAddress, OldProvinceAddress, OldWardAddress } from '@models/address.model';
import { AddressService } from '@services/address.service';
import { OldAddressInputComponent } from './old-address/old-address-input.component';
import { NewAddressInputComponent } from './new-address/new-address-input.component';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { AddressConfirmDialogComponent } from './address-confirm-dialog/addres-confirm-dialog.component';

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
        MatRadioModule,
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
    oldProvinceControl = new FormControl<OldProvinceAddress | null>(null);
    oldDistrictControl = new FormControl<OldDistrictAddress | null>(null);
    oldWardControl = new FormControl<OldWardAddress | null>(null);

    newProvinceControl = new FormControl<NewProvinceAddress | null>(null);
    newWardControl = new FormControl<NewWardAddress | null>(null);

    // Radio button control
    addressModeControl = new FormControl<string>('old');

    constructor(
        private addressService: AddressService,
        private dialog: MatDialog
    ) { }

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


    onAddressModeChange(mode: string): void {
        this.addressModeControl.setValue(mode);
        this.clearAllAddressData();
    }
    clearAllAddressData(): void {
        // Clear old address data
        this.oldProvinceControl.setValue(null);
        this.oldDistrictControl.setValue(null);
        this.oldWardControl.setValue(null);

        // Clear new address data
        this.newProvinceControl.setValue(null);
        this.newWardControl.setValue(null);

        // Reset lists
        this.listOldProvince = this.oldProvince;
        this.listOldDistrict = [];
        this.listOldWard = [];
        this.listNewProvince = this.newProvince;
        this.listNewWard = [];
    }

    onSaveAddress(): void {
        const addressMode = this.addressModeControl.value;

        if (addressMode === 'new') {
            // Nếu chọn nhập địa chỉ mới, hiện popup xác nhận
            this.showSaveConfirmDialog();
        } else {
            // Nếu chọn nhập địa chỉ cũ, lưu trực tiếp
            this.saveAddressData();
        }
    }

    showSaveConfirmDialog(): void {
        const dialogRef = this.dialog.open(AddressConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Xác nhận lưu địa chỉ',
                message: 'Bạn có muốn lưu thông tin địa chỉ cũ không?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'confirm') {
                // Người dùng chọn có -> chuyển sang chế độ nhập địa chỉ cũ
                this.addressModeControl.setValue('both');
                this.saveAddressData();
            } else if (result === 'save') {
                // Người dùng chọn không -> lưu luôn
                this.saveAddressData();
            }
            // Nếu result là undefined (đóng dialog) -> không làm gì cả
        });
    }

    saveAddressData(): void {
        const addressMode = this.addressModeControl.value;
        const addressData = {
            mode: addressMode,
            oldAddress: {
                province: this.oldProvinceControl.value,
                district: this.oldDistrictControl.value,
                ward: this.oldWardControl.value
            },
            newAddress: {
                province: this.newProvinceControl.value,
                ward: this.newWardControl.value
            }
        };

        console.log('Saving address data:', addressData);

        // TODO: Implement actual save logic here
        // this.addressService.saveAddress(addressData).subscribe(...)

        alert('Đã lưu thông tin địa chỉ thành công!');
    }

    onAddressModeChangeSafe(newMode: string): void {
        const currentMode = this.addressModeControl.value;
        console.log('currentMode', currentMode);
        console.log('newMode', newMode);

        const hasOldAddressData = !!this.oldProvinceControl.value;
        const hasNewAddressData = !!this.newProvinceControl.value;

        if (
            (currentMode === 'old' && hasOldAddressData) ||
            (currentMode === 'new' && hasNewAddressData) ||
            (currentMode === 'both' && (hasOldAddressData || hasNewAddressData))
        ) {
            // Hiện popup cảnh báo
            const dialogRef = this.dialog.open(AddressConfirmDialogComponent, {
                width: '400px',
                data: {
                    title: 'Chuyển chế độ nhập',
                    message: 'Thao tác này sẽ làm mất thông tin địa chỉ đã nhập. Bạn có chắc chắn muốn tiếp tục?'
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === 'confirm') {
                    this.onAddressModeChange(newMode);
                }
                // Nếu là cancel thì không làm gì
            });
        } else {
            this.onAddressModeChange(newMode);
        }
    }


    onOldProvinceSelected(selected: OldProvinceAddress) {
        this.oldProvinceControl.setValue(selected);
        const mapping = this.newProvince.find(np =>
            np.mergeProvince.includes(selected.oldProvinceID)
        );
        console.log("mapping", mapping);

        if (mapping) {
            this.newProvinceControl.setValue(mapping || null);
        }
        this.listOldDistrict = [
            ...new Set(
                this.oldDistricts.
                    filter(a => a.oldProvinceID === selected.oldProvinceID)
            )
        ];
        // Clear formControl huyện cũ
        this.oldDistrictControl.setValue(null);
        this.listOldWard = [];

        this.newWardControl.setValue(null);
        this.listNewWard = [
            ...new Set(
                this.newWards.
                    filter(a => a.newProvinceID === mapping?.newProvinceID)
            )
        ];
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
            this.newWardControl.setValue(mapping || null)
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
                this.oldProvinceControl.setValue(province || null)
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
        this.oldProvinceControl.setValue(null);
        this.oldDistrictControl.setValue(null);
        this.oldWardControl.setValue(null);

        this.listOldProvince = this.oldProvince;
        this.listOldDistrict = [];
        this.listOldWard = [];

        // Xóa dữ liệu địa chỉ mới
        this.newProvinceControl.setValue(null);
        this.newWardControl.setValue(null);
        this.listNewWard = [];
    }

    onOldDistrictCleared(): void {
        this.oldDistrictControl.setValue(null);
        this.oldWardControl.setValue(null);
        this.listOldWard = [];

        this.newWardControl.setValue(null);
    }

    onOldWardCleared(): void {
        this.oldWardControl.setValue(null);
        this.newWardControl.setValue(null);
        this.listNewWard = [];
    }

    onNewProvinceCleared(): void {
        this.newProvinceControl.setValue(null);
        this.newWardControl.setValue(null);

        this.oldProvinceControl.setValue(null);
        this.oldDistrictControl.setValue(null);
        this.oldWardControl.setValue(null);

        this.listOldProvince = this.oldProvince;
        this.listOldDistrict = [];
        this.listOldWard = [];
        this.listNewWard = [];
    }

    onNewWardCleared(): void {
        this.newWardControl.setValue(null);

        this.oldDistrictControl.setValue(null);
        this.listOldDistrict = this.oldDistricts.filter(d => d.oldProvinceID === this.oldProvinceControl.value?.oldProvinceID);
        this.oldWardControl.setValue(null);
        this.listOldWard = [];
    }
}