import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressOld, AddressNew, NewProvinceAddress, NewWardAddress, OldProvinceAddress, OldDistrictAddress, OldWardAddress } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
    constructor(private http: HttpClient) { }

    getOldAddresses(): Observable<AddressOld[]> {
        return this.http.get<AddressOld[]>('assets/data/old-addresses.json');
    }

    getNewAddresses(): Observable<AddressNew[]> {
        return this.http.get<AddressNew[]>('assets/data/new-addresses.json');
    }

    getNewProvince(): Observable<NewProvinceAddress[]> {
        return this.http.get<NewProvinceAddress[]>('assets/data/new-province.json');
    }

    getNewWards(): Observable<NewWardAddress[]> {
        return this.http.get<NewWardAddress[]>('assets/data/new-ward.json');
    }

    getOldProvince(): Observable<OldProvinceAddress[]> {
        return this.http.get<OldProvinceAddress[]>('assets/data/old-province.json');
    }

    getOldDistrict(): Observable<OldDistrictAddress[]> {
        return this.http.get<OldDistrictAddress[]>('assets/data/old-district.json');
    }

    getOldWard(): Observable<OldWardAddress[]> {
        return this.http.get<OldWardAddress[]>('assets/data/old-ward.json');
    }
}
