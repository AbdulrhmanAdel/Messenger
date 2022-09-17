import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseComponent } from './pages/base/base.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthorizationInterceptor } from './core/shared/interceptors/authorization.intceptor';
import { AuthCoreModule } from './core/auth/auth-core.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './core/store/auth/auth.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
  declarations: [AppComponent, BaseComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthCoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
