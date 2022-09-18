import { UserAuthModel } from '../../auth/models/user-auth.model';

export namespace AuthActions {
  export class LoadUserData {
    static readonly type = '[Auth] Request Logged In User Data';
  }

  export class CheckAuth {
    static readonly type = '[Auth] User Logged In';
  }

  export class UserLoggedIn {
    static readonly type = '[Auth] User Logged In';

    constructor(public data: UserAuthModel) {}
  }

  export class LoggedOutRequested {
    static readonly type = '[Auth] User Logged Out';
  }

  export class UserRegistered {
    static readonly type = '[Auth] User Registered In';

    constructor(public data: UserAuthModel) {}
  }
}
