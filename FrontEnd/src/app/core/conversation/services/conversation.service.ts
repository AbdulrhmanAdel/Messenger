import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponseModel } from '../../shared/models/responses/paged-response.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PagedQueryV1Model } from '../../shared/models/requests/paged-query-v1.model';

const BASE_CONVERSATION_V1 = environment.appV1Url + '/Conversation';
@Injectable()
export class ConversationService {
  constructor(private httpClient: HttpClient) {}

  getConversation(
    query: PagedQueryV1Model
  ): Observable<PagedResponseModel<any>> {
    return this.httpClient.get<PagedResponseModel<any>>(
      BASE_CONVERSATION_V1 + '/getPagedList',
      {
        params: { ...query },
      }
    );
  }
}
