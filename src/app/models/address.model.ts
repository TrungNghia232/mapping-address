export interface AddressOld {
    province: string;
    district: string;
    ward: string;
    code: string;
}

export interface AddressNew {
    id: string;
    province: string;
    district: string;
    ward: string;
    mergedWards: string[];
}

export interface OldProvinceAddress {
    oldProvinceID: string;
    oldProvinceName: string;
}
export interface OldDistrictAddress {
    oldDistrictID: string;
    oldDistrictName: string;
    oldProvinceID: string;
}
export interface OldWardAddress {
    oldWardID: string;
    oldWardName: string;
    oldDistrictID: string;
}
export interface NewProvinceAddress {
    newProvinceID: string;
    newProvinceName: string;
    mergeProvince: string[];
}
export interface NewWardAddress {
    newWardID: string;
    newWardName: string;
    mergeWard: string[];
    newProvinceID: string;
}