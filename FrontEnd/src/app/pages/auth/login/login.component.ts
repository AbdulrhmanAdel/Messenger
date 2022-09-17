import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import { catchError, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../../core/store/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  hidePassword = true;
  loginForm: FormGroup;

  invalidCred = false;
  private _unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });

    this.loginForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => (this.invalidCred = false));
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService
      .login({
        credential: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .pipe(
        takeUntil(this._unsubscribe),
        catchError((err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status) this.invalidCred = true;
          throw err;
        })
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.store.dispatch(new AuthActions.UserLoggedIn(response.data));
      });
  }
}
