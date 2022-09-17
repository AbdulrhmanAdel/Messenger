export interface AuthTokenModel {
  accessToken: string;
  refreshToken: string;
  expireAt: Date;
}
