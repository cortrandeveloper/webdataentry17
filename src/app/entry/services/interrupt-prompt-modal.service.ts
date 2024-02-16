import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterruptPromptModalService {
  isOpen = signal(false);

  constructor() { }

  toggle() {
    this.isOpen.update(value => !value);
  }

  open() {
    this.isOpen.update(() => true);
  }

  close() {
    this.isOpen.update(() => false);
  }
}
