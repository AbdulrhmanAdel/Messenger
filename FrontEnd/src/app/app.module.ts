import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthCoreModule } from './core/auth/auth-core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './core/store/auth/auth.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserCoreModule } from './core/user/user-core.module';

// Http
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthorizationInterceptor } from './core/shared/interceptors/authorization.intceptor';
import { ErrorInterceptor } from './core/shared/interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthCoreModule,
    UserCoreModule,

    MatSnackBarModule,
    NgxsModule.forRoot([AuthState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
