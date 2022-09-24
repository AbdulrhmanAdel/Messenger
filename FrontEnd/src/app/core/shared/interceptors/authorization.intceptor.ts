import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';
import { AuthActions } from '../../store/auth';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(AuthState.userAccessToken);
    let newReq = req;
    if (token) {
      newReq = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + token,
        },
      });
    }

    return next.handle(newReq);
  }
}
