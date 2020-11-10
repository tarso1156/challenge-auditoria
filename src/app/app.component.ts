import { Component } from '@angular/core';

import { MessageService } from './core/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Desafio - Software Auditoria';

  getShowLoadingFidget() {
    return MessageService.showLoadingFidget;
  }

}
