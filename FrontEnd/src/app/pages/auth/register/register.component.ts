import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  emailAlreadyExists: boolean;

  // Form
  registerForm: FormGroup;
  hasError = false;
  // Clean Up
  private _unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const passwordControl = new FormControl(null, [Validators.required]);
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: passwordControl,
      confirmPassword: [
        null,
        [
          Validators.required,
          ({ value }: AbstractControl) => {
            if (value != passwordControl.value) {
              return { invalidConfirmPassword: 'password not the same' };
            }
            return null;
          },
        ],
      ],
    });

    this.registerForm.valueChanges
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => (this.emailAlreadyExists = false));
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.authService
      .register({
        credential: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
      })
      .pipe(
        takeUntil(this._unsubscribe),
        catchError((err: HttpErrorResponse) => {
          // if (err.status == 400) this.invalidCred = true;
          throw err;
        })
      )
      .subscribe();
  }
}
