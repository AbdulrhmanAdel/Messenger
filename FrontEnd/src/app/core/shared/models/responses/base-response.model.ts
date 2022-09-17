export interface BaseResponseModel {
  customErrorCode?: number;
  isSuccesses: boolean;
  errorMessages: string[];
}
