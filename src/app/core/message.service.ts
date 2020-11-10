import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

export type MessageStyle = 'error' | 'warn' | 'success';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public snackBar: MatSnackBar) { }

  static showLoadingFidget = false;
  static pendingRequests = 0;

  static displayLoading() {
    setTimeout(() => {
      MessageService.pendingRequests++;
      MessageService.showLoadingFidget = true;
    });
  }

  static hideLoading() {
    if (--MessageService.pendingRequests === 0) {
      MessageService.showLoadingFidget = false;
    }
  }

  private displayMessage(message: string, style: MessageStyle = 'success') {
    this.snackBar.open(message, null, { panelClass: `msg-${style}` });
  }

  displayWarnMessage(message: string) {
    this.displayMessage(message, 'warn');
  }

  displayErrorMessage(message: string) {
    this.displayMessage(message, 'error');
  }

  displaySuccessMessage(message: string) {
    this.displayMessage(message);
  }

}
