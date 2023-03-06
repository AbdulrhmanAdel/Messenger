// #region Angular
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// #endregion

// Angular Material
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

// Store
import {NgxsModule} from '@ngxs/store';
import {MessageState} from '../../core/store/messages/message.state';
import {ConversationState} from '../../core/store/conversations/conversation.state';

import {BaseRoutingModule} from './base-routing.module';
import {ConversationListComponent} from '../conversation/conversation-list/conversation-list.component';
import {ResolveConversationNamePipe} from '../conversation/pipes/conversation-name.pipe';
import {ConversationViewComponent} from '../conversation/conversation-view/conversation-view.component';
import {ResolveMessageOwnerImagePipe} from '../conversation/pipes/resolve-message-owner-image.pipe';
import {UserCoreModule} from '../../core/user/user-core.module';

import {SharedModule} from '../shared/shared.module';
import {ConversationCoreModule} from '../../core/conversation/conversation-core.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {BaseComponent} from './base.component';
import {MessagesCoreModule} from "../../core/messages/messages-core.module";
import {UserPreferencesComponent} from "../user-preferences/user-preferences.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    // Components
    BaseComponent,
    ConversationListComponent,
    ConversationViewComponent,
    UserPreferencesComponent,

    // Pipes
    ResolveConversationNamePipe,
    ResolveMessageOwnerImagePipe,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    NgxsModule.forFeature([ConversationState, MessageState]),
    UserCoreModule,

    // Angular Material
    MatMenuModule,
    MatIconModule,
    MatDialogModule,

    SharedModule,
    ConversationCoreModule,
    MessagesCoreModule,
    InfiniteScrollModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BaseModule {
}
