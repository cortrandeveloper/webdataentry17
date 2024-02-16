import { Injectable, inject, signal } from '@angular/core';
import { InterruptPromptModalService } from './interrupt-prompt-modal.service';

@Injectable({
  providedIn: 'root'
})
export class OptionModalService {

  isOpen = signal(false);
  actionName = signal<string>('');

  constructor() { }

  toggle(actionName: string) {
    this.actionName.update(() => actionName);
    this.isOpen.update(value => !value);
  }

  open(actionName: string) {
    this.actionName.update(() => actionName);
    this.isOpen.update(() => true);
  }

  close() {
    this.actionName.update(() => '');
    this.isOpen.update(() => false);
  }

}
