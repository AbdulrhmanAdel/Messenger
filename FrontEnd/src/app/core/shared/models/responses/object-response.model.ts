import { BaseResponseModel } from './base-response.model';

export interface ObjectResponseModel<T> extends BaseResponseModel {
  data: T;
}
