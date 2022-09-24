import { Injectable, NgZone } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthActions } from '../../store/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private ngZone: NgZone,
    private snakeBar: MatSnackBar,
    private store: Store
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let message: string = '';

        // Skip 400 will be handled in the component
        switch (err.status) {
          case 0: {
            message = `Can't connect to server`;
            break;
          }

          case 401: {
            // Try Refresh Token, But For Now Let User Login again
            this.store.dispatch(new AuthActions.LoggedOutRequested());
            break;
          }

          case 500: {
            message = 'Server error: ';
            message +=
              err.error.errorMessages && err.error.errorMessages.length
                ? err.error.errorMessages.join(', ')
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
