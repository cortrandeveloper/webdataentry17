import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationBarService {

  public notificationMessage = signal<string | null | undefined>('');
  public notificationCss = signal<string>('xentry-message-bar-info');

  constructor() { }

  setErrorMessage(notificationMessage: string | null | undefined) {
    this.notificationMessage.set(notificationMessage);
    this.notificationCss.set('xentry-message-bar-warning');
  }

  setInfoMessage(notificationMessage: string | null | undefined) {
    this.notificationMessage.set(notificationMessage);
    this.notificationCss.set('xentry-message-bar-info');
  }
}
