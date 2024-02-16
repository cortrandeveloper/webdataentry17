import { InterruptPromptModalService } from './../../../../services/interrupt-prompt-modal.service';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild
} from '@angular/core';

import { HostListener } from '@angular/core';
import { MenuModalService } from 'src/app/entry/services/menu-modal.service';
import { OptionModalService } from 'src/app/entry/services/option-modal.service';

interface ModalMenuItem {
  triggerKey: string;
  description: string;
  actionName: string;
}

@Component({
  selector: 'entry-modal-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-container.component.html',
  styleUrl: './menu-container.component.css',
})
export class ModalMenuContainerComponent {
  menuModalService = inject(MenuModalService);
  optionModalService = inject(OptionModalService);
  interruptPromptModalService = inject(InterruptPromptModalService);
  @ViewChild('modalDialog') modalDialog!: ElementRef;
  selectedIndex: number = 0;

  menuF1 = signal<ModalMenuItem[]>([
    { triggerKey: 'P', description: 'Pause App', actionName: 'todo' },
    { triggerKey: 'I', description: 'Interrupt Document', actionName: 'interrupt' },
    { triggerKey: 'F', description: 'Set Flag Field', actionName: 'todo' },
    { triggerKey: 'D', description: 'Set Flag Document', actionName: 'todo' },
    { triggerKey: 'Q', description: 'Enable FindOnStatus', actionName: 'todo' },
    { triggerKey: 'W', description: 'Disable FindOnStatus', actionName: 'todo' },
    { triggerKey: 'F2', description: 'Show Values', actionName: 'showValues' },
    { triggerKey: 'F3', description: 'Last Keyed', actionName: 'todo' },
    { triggerKey: 'F11', description: 'Enable Embed Keyboard', actionName: 'todo' },
    { triggerKey: 'F12', description: 'Disable Embed Keyboard', actionName: 'todo' },
    { triggerKey: 'U', description: 'Remove ReadOnly At Document', actionName: 'todo' },
    { triggerKey: 'Y', description: 'Override Status At Document', actionName: 'todo' }
  ]);

  constructor() {
    effect(() => {
      if (this.menuModalService.isOpen()) {

        this.focusMenuItemByIndex(0);
      }
    });
  }

  getMenuItemId(menuItem: ModalMenuItem) {
    return `modal-menu-item-${menuItem.triggerKey}`;
  }

  isMenuItemActive(menuItem: ModalMenuItem) {

    const result = this.menuF1().indexOf(menuItem) === this.selectedIndex;

    return result;
  }

  focusMenuItemByIndex(index: number) {
    const menuItem = this.menuF1()[index];
    const menuItemId = this.getMenuItemId(menuItem);
    document.getElementById(menuItemId)?.focus();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.menuModalService.isOpen()) return;

    console.log('handleKeyboardEvent', event.key);
    if (event.key === 'Escape') {
      this.menuModalService.close();
      return;
    }

    if (event.key === 'Enter') {
      this.handleEnter(event);
      return;
    }

    if (event.key === 'ArrowDown') {
      this.handleArrowDown(event);
      return;
    }

    if (event.key === 'ArrowUp') {
      this.handleArrowUp(event);
      return;
    }

    const menuItems = this.menuF1();
    const index = menuItems.findIndex((item) => item.triggerKey.toLowerCase() === event.key.toLowerCase());

    if (index === -1) return;

    this.selectedIndex = index;
    this.focusMenuItemByIndex(index);
    this.openMenuItem(menuItems[index].actionName);
  }

  handleEnter(event: KeyboardEvent) {

    const menuItems = this.menuF1();
    this.openMenuItem(menuItems[this.selectedIndex].actionName);
  }

  handleArrowDown(event: KeyboardEvent) {

    const menuItems = this.menuF1();

    if (!menuItems[this.selectedIndex + 1]) return;

    this.selectedIndex = this.selectedIndex + 1;
    this.focusMenuItemByIndex(this.selectedIndex);
  }

  handleArrowUp(event: KeyboardEvent) {

    const menuItems = this.menuF1();

    if (!menuItems[this.selectedIndex - 1]) return;

    this.selectedIndex = this.selectedIndex - 1;
    this.focusMenuItemByIndex(this.selectedIndex);
  }

  openMenuItem(actionName: string) {

    this.menuModalService.close();

    if (actionName === 'interrupt')
      this.interruptPromptModalService.open();
    else
      this.optionModalService.open(actionName);
  }
}
