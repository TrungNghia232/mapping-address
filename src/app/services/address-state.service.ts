import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  NewProvinceAddress,
  NewWardAddress,
  OldDistrictAddress,
  OldProvinceAddress,
  OldWardAddress,
} from '../models/address.model';
import { AddressService } from './address.service'; // Your existing service to fetch data

@Injectable({
  providedIn: 'root',
})
export class AddressStateService {
  private _newProvinces = new BehaviorSubject<NewProvinceAddress[]>([]);
  private _newWards = new BehaviorSubject<NewWardAddress[]>([]);
  private _oldProvinces = new BehaviorSubject<OldProvinceAddress[]>([]);
  private _oldDistricts = new BehaviorSubject<OldDistrictAddress[]>([]);
  private _oldWards = new BehaviorSubject<OldWardAddress[]>([]);

  // Expose observables for other components/services to subscribe to
  readonly newProvinces$: Observable<NewProvinceAddress[]> = this._newProvinces.asObservable();
  readonly newWards$: Observable<NewWardAddress[]> = this._newWards.asObservable();
  readonly oldProvinces$: Observable<OldProvinceAddress[]> = this._oldProvinces.asObservable();
  readonly oldDistricts$: Observable<OldDistrictAddress[]> = this._oldDistricts.asObservable();
  readonly oldWards$: Observable<OldWardAddress[]> = this._oldWards.asObservable();

  constructor(private addressService: AddressService) {
    // Tải tất cả dữ liệu khi service được khởi tạo
    this.loadAllAddressData();
  }

  private loadAllAddressData(): void {
    this.addressService.getNewProvince().subscribe((data) => this._newProvinces.next(data));
    this.addressService.getNewWards().subscribe((data) => this._newWards.next(data));
    this.addressService.getOldProvince().subscribe((data) => this._oldProvinces.next(data));
    this.addressService.getOldDistrict().subscribe((data) => this._oldDistricts.next(data));
    this.addressService.getOldWard().subscribe((data) => this._oldWards.next(data));
  }

  // Phương thức trợ giúp để lấy giá trị hiện tại (snapshot)
  getNewProvincesSnapshot(): NewProvinceAddress[] { return this._newProvinces.getValue(); }
  getNewWardsSnapshot(): NewWardAddress[] { return this._newWards.getValue(); }
  getOldProvincesSnapshot(): OldProvinceAddress[] { return this._oldProvinces.getValue(); }
  getOldDistrictsSnapshot(): OldDistrictAddress[] { return this._oldDistricts.getValue(); }
  getOldWardsSnapshot(): OldWardAddress[] { return this._oldWards.getValue(); }
}