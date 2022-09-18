import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import {catchError, Subject, switchMap, takeUntil} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthActions } from '../../../core/store/auth';
import {Router} from "@angular/router";
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

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store,
    private router: Router
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

  private _unsubscribe = new Subject<void>();
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
        switchMap(res => {
          return this.store.dispatch(new AuthActions.UserLoggedIn(res.data));
        }),
        catchError((err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status) this.invalidCred = true;
          throw err;
        })
      )
      .subscribe(() => {
        this.isLoading = false;
        this.router.navigateByUrl('');
      });
  }
}
