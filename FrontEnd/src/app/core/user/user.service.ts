import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { H } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../shared/models/responses/paged-response.model';
import { PagedQueryV1Model } from '../shared/models/requests/paged-query-v1.model';
import { HttpHelper } from '../shared/helpers/http-helper';

const usersBaseUrl = environment.appV1Url + '/User';

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getPagedList(params: PagedQueryV1Model): Observable<PagedResponseModel<any>> {
    return this.httpClient.get<PagedResponseModel<any>>(
      usersBaseUrl + '/getPagedList',
      {
        params: HttpHelper.buildPagedQueryParams(params),
      }
    );
  }
}
