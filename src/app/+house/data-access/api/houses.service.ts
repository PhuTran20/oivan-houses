import { ResponseResult, ResponseObjectResult } from '../../../shared/data-access/interface/response.type';
import { HttpClient } from '@angular/common/http';
import { HousesModel } from "../model/houses.model";
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HousesService {
    constructor(
        private _http: HttpClient,
    ) { }
    GetAllHouses() {
        return this._http.get<ResponseResult<HousesModel.Response>>('houses');
    }
    GetHouseById(houseId: string) {
        return this._http.get<ResponseObjectResult<HousesModel.Response>>(`houses/${houseId}`);
    }
    EditHouse(data: HousesModel.Response) {
        return this._http.patch<ResponseObjectResult<HousesModel.Response>>(`houses/${data.id}`, { data });
    }
    CreateHouse(data: HousesModel.Response) {
        return this._http.post<ResponseObjectResult<HousesModel.Response>>('houses', { data });
    }
}