import { PagedQueryV1Model } from '../models/requests/paged-query-v1.model';

export class HttpHelper {
  static buildPagedQueryParams(params: PagedQueryV1Model) {
    return { ...params };
  }
}
