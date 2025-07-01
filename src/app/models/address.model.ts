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