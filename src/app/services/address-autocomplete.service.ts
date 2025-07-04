import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AddressStateService } from './address-state.service';
import {
  NewProvinceAddress,
  NewWardAddress,
  OldDistrictAddress,
  OldProvinceAddress,
  OldWardAddress,
} from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressAutocompleteService {
  constructor(private addressState: AddressStateService) {}

  // --- Hàm thiết lập Autocomplete chung ---
  setupAutocomplete<T>(
    control: FormControl,
    fullListObservable: Observable<T[]>, // Observable của danh sách đầy đủ
    filterFn: (value: string, list: T[]) => T[]
  ): Observable<T[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map((value) => {
        // Lấy snapshot hiện tại của danh sách đầy đủ
        let currentList: T[] = [];
        fullListObservable.subscribe(data => currentList = data).unsubscribe(); // Tạm thời subscribe để lấy giá trị hiện tại

        // Áp dụng bộ lọc hoặc trả về bản sao của danh sách đầy đủ nếu không có giá trị
        return value ? filterFn(value, currentList) : currentList.slice();
      })
    );
  }

  // --- Hàm lọc dữ liệu cho từng loại địa chỉ ---
  filterOldProvinces(value: string, list: OldProvinceAddress[]): OldProvinceAddress[] {
    const filterValue = value ? value.toLowerCase() : '';
    return list.filter((p) => p.oldProvinceName.toLowerCase().includes(filterValue));
  }

  filterOldDistricts(value: string, list: OldDistrictAddress[]): OldDistrictAddress[] {
    const filterValue = value ? value.toLowerCase() : '';
    return list.filter((d) => d.oldDistrictName.toLowerCase().includes(filterValue));
  }

  filterOldWards(value: string, list: OldWardAddress[]): OldWardAddress[] {
    const filterValue = value ? value.toLowerCase() : '';
    return list.filter((w) => w.oldWardName.toLowerCase().includes(filterValue));
  }

  filterNewProvinces(value: string, list: NewProvinceAddress[]): NewProvinceAddress[] {
    const filterValue = value ? value.toLowerCase() : '';
    return list.filter((p) => p.newProvinceName.toLowerCase().includes(filterValue));
  }

  filterNewWards(value: string, list: NewWardAddress[]): NewWardAddress[] {
    const filterValue = value ? value.toLowerCase() : '';
    return list.filter((w) => w.newWardName.toLowerCase().includes(filterValue));
  }

  // --- Hàm hiển thị giá trị cho Autocomplete Input ---
  // Các hàm này cần truy cập snapshot từ AddressStateService
  displayOldProvince = (oldProvinceID: string): string => {
    const province = this.addressState.getOldProvincesSnapshot().find((p) => p.oldProvinceID === oldProvinceID);
    return province ? province.oldProvinceName : '';
  };

  displayOldDistrict = (oldDistrictID: string): string => {
    const district = this.addressState.getOldDistrictsSnapshot().find((d) => d.oldDistrictID === oldDistrictID);
    return district ? district.oldDistrictName : '';
  };

  displayOldWard = (oldWardID: string): string => {
    const ward = this.addressState.getOldWardsSnapshot().find((w) => w.oldWardID === oldWardID);
    return ward ? ward.oldWardName : '';
  };

  displayNewProvince = (newProvinceID: string): string => {
    const province = this.addressState.getNewProvincesSnapshot().find((p) => p.newProvinceID === newProvinceID);
    return province ? province.newProvinceName : '';
  };

  displayNewWard = (newWardID: string): string => {
    const ward = this.addressState.getNewWardsSnapshot().find((w) => w.newWardID === newWardID);
    return ward ? ward.newWardName : '';
  };
}