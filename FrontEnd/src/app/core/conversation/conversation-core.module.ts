import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from './services/message.service';
import {ConversationService} from "./services/conversation.service";

@NgModule({
  imports: [],
  providers: [MessageService, ConversationService],
})
export class ConversationCoreModule {}
