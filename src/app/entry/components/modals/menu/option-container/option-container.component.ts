import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { OptionModalService } from '../../../../services/option-modal.service';
import { OptionShowValuesComponent } from '../optionShowValues/option-showValues.component';

@Component({
  selector: 'entry-modal-option',
  standalone: true,
  imports: [
    CommonModule,
    OptionShowValuesComponent
  ],
  templateUrl: './option-container.component.html',
  styleUrl: './option-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalOptionComponent {

  optionModalService = inject(OptionModalService);


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.optionModalService.isOpen()) return;

    console.log('prevent');
    event.preventDefault();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEventEscape(event: KeyboardEvent) {
    if (!this.optionModalService.isOpen()) return;

    this.optionModalService.close();
  }

 }
