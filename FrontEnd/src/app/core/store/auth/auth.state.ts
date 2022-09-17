import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Select, State, StateContext } from '@ngxs/store';
import { AuthService } from '../../auth/services/auth.service';
import { AuthActions } from './auth.actions';
import { AuthStateModel } from './auth-state.model';

@State<AuthStateModel>({
  name: 'auth',
})
@Injectable()
export class AuthState implements NgxsOnInit {
  constructor(private authService: AuthService) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
    const tokenModel = this.authService.getToken();

    if (tokenModel) {
      ctx.setState((state) => ({
        ...state,
        tokenDetails: tokenModel,
        isAuthenticated: true,
      }));
    }
  }

  @Action(AuthActions.UserLoggedIn)
  userLoggedIn(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.UserLoggedIn
  ) {
    this.authService.setToken(action.data.tokenDetails);
    ctx.setState({ ...action.data, isAuthenticated: true });
  }

  @Action(AuthActions.UserRegistered)
  userRegistered(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.UserRegistered
  ) {
    this.authService.setToken(action.data.tokenDetails);
    ctx.setState({ ...action.data, isAuthenticated: true });
  }

  @Select()
  static userAccessToken(state: { auth: AuthStateModel }) {
    return state?.auth?.tokenDetails?.accessToken;
  }

  @Select()
  static isAuthenticated(state: { auth: AuthStateModel }) {
    return !!state?.auth?.isAuthenticated;
  }
}
