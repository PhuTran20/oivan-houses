import { ResponseObjectResult } from '../../../shared/data-access/interface/response.type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoginModel } from '../model/login.model';
import { LocalStorage } from '../../../shared/data-access/store';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private localStorageService: LocalStorage,
  ) {}
  AuthLogin(model: ResponseObjectResult<LoginModel.Request>) {
    return this._http.post<ResponseObjectResult<LoginModel.Response>>(
      'auth',
      model,
    );
  }
  createLoginRequest = ({username, password}: LoginModel.LoginRequestAttributes): ResponseObjectResult<LoginModel.Request> => {
    return {
      data: {
        type: 'auth',
        attributes: {
          username,
          password,
        },
      },
    };
  };
  isLoggedIn() {
    return !!this.localStorageService.get('authToken');
  };
  logout() {
    this.localStorageService.remove('authToken');
  };
}
