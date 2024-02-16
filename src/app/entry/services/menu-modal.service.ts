import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuModalService {
  isOpen = signal(false);
  selectedMenu = signal<string>('');

  constructor() { }

  toggle(menuName: string) {
    this.isOpen.update(value => !value);
    this.selectedMenu.update(() => menuName);
  }

  open(menuName: string) {
    this.isOpen.update(() => true);
    this.selectedMenu.update(() => menuName);
  }

  close() {
    this.isOpen.update(() => false);
    this.selectedMenu.update(() => '');
  }
}
