import { AuthTokenModel } from '../../auth/models/auth-token.model';

export class AuthStateModel {
  userDetails: any;
  isAuthenticated: boolean;
  tokenDetails: AuthTokenModel | null;
}
