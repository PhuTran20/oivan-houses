import { ResponseResult } from '../../../shared/data-access/interface/response.type';
import { HttpClient } from '@angular/common/http';
import { HouseModelsModel } from "../model/house-models.model";
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class HouseModelsService {
    constructor(
        private _http: HttpClient,
    ) { }
    GetAllHouseModels() {
        return this._http.get<ResponseResult<HouseModelsModel.Response>>('house_models');
    }
}