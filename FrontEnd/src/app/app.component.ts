import { Component } from '@angular/core';
import { RealtimeChatService } from './core/shared/services/realtime/realtime-chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'FrontEnd';

  constructor() {}
}
