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

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store,
    private ngZone: NgZone,
    private snakeBar: MatSnackBar
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

    return next.handle(newReq).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = '';

        switch (err.status) {
          case 0: {
            message = `Can't connect to server`;
            break;
          }

          case 500: {
            message = 'Server error: ';
            message +=
              err.error.errorMessages && err.error.errorMessages.length
                ? err.error.errorMessages[0]
                : '';
            break;
          }
        }

        if (message) {
          this.ngZone.run(() =>
            this.snakeBar.open(message, 'close', {
              duration: 5000,
            })
          );
        }

        throw err;
      })
    );
  }
}
