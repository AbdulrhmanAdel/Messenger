import { BaseResponseModel } from './base-response.model';

export interface PagedResponseModel<T> extends BaseResponseModel {
  data: T[];
  totalCount: number;
}
