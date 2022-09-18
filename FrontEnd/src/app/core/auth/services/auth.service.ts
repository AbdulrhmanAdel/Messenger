import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterModel } from '../models/register.model';
import { Observable, tap } from 'rxjs';
import { ObjectResponseModel } from '../../shared/models/responses/object-response.model';
import { UserAuthModel } from '../models/user-auth.model';

const authUrlV1 = environment.hostUrl + '/App/V1/Auth';
const userUrlV1 = environment.hostUrl + '/App/V1/User';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(loginModel: {
    credential: string;
    password: string;
  }): Observable<ObjectResponseModel<UserAuthModel>> {
    return this.httpClient.post<any>(authUrlV1 + '/Login', loginModel);
  }

  register(
    registerModel: RegisterModel
  ): Observable<ObjectResponseModel<UserAuthModel>> {
    return this.httpClient.post<any>(authUrlV1 + '/Register', registerModel);
  }

  loadUserData(): Observable<ObjectResponseModel<any>> {
    return this.httpClient.get<ObjectResponseModel<any>>(
      userUrlV1 + '/GetCurrentUserData'
    );
  }

  getToken(): any {
    const token = localStorage.getItem('authTokenModel');
    return token ? JSON.parse(token) : null;
  }

  setToken(token: any) {
    localStorage.setItem('authTokenModel', JSON.stringify(token));
  }

  logOut() {
    localStorage.removeItem('authTokenModel');
  }
}
