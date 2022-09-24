import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { H } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../shared/models/responses/paged-response.model';

const usersBaseUrl = environment.appV1Url + '/User';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getPagedList(): Observable<PagedResponseModel<any>> {
    return this.httpClient.get<PagedResponseModel<any>>(
      usersBaseUrl + '/getPagedList'
    );
  }
}
