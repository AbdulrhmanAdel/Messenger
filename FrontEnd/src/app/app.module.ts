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
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserCoreModule } from './core/user/user-core.module';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from './pages/shared/shared.module';
import { ConversationListComponent } from './pages/conversation/conversation-list/conversation-list.component';
import { ResolveConversationNamePipe } from './pages/conversation/pipes/conversation-name.pipe';
import { ConversationViewComponent } from './pages/conversation/conversation-view/conversation-view.component';
import { ConversationCoreModule } from './core/conversation/conversation-core.module';
import { ErrorInterceptor } from './core/shared/interceptors/error.interceptor';
import { ConversationState } from './core/store/conversations/conversation.state';
import {MatIconModule} from "@angular/material/icon";
import { ResolveMessageOwnerImagePipe } from './pages/conversation/pipes/resolve-message-owner-image.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    ConversationListComponent,
    ResolveConversationNamePipe,
    ConversationViewComponent,
    ResolveMessageOwnerImagePipe,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AuthCoreModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        NgxsModule.forRoot([AuthState, ConversationState]),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        MatInputModule,
        MatAutocompleteModule,
        UserCoreModule,
        MatMenuModule,
        SharedModule,
        ConversationCoreModule,
        MatIconModule,
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
