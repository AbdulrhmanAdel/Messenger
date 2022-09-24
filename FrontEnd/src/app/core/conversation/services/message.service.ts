import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedQueryV1Model } from '../../shared/models/requests/paged-query-v1.model';
import { HttpHelper } from '../../shared/helpers/http-helper';

const MESSAGES_V1_URL = environment.appV1Url + '/Message';
@Injectable()
export class MessageService {
  constructor(private httpClient: HttpClient) {}

  sendMessage(message: {
    conversationId: string;
    message: string;
  }): Observable<any> {
    return this.httpClient.post(MESSAGES_V1_URL + '/Post', message);
  }

  getPagedList(query: PagedQueryV1Model): Observable<any> {
    return this.httpClient.get(MESSAGES_V1_URL + '/GetPagedList', {
      params: { ...query },
    });
  }
}
