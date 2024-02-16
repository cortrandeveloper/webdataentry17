import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, effect, inject } from '@angular/core';
import { EntryFormService } from 'src/app/entry/services/entry-form.service';
import { InterruptPromptModalService } from 'src/app/entry/services/interrupt-prompt-modal.service';

@Component({
  selector: 'entry-interrupt-prompt-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './interrupt-prompt-modal.component.html',
  styleUrl: './interrupt-prompt-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterruptPromptModalComponent implements AfterViewInit {

  @ViewChild('actionButton') actionButton!: ElementRef;;
  private interruptPromptModalService = inject(InterruptPromptModalService);
  private entryformService = inject(EntryFormService);

  constructor() {
    effect(() => {
      if (this.interruptPromptModalService.isOpen()) {

        this.actionButton.nativeElement.focus();
      }
    });
  }

  ngAfterViewInit(): void {
    //this.saveButton.nativeElement.focus();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    console.log('handleKeyboardEvent called', event.key);
    event.preventDefault();

    if (!this.interruptPromptModalService.isOpen()) return;

    console.log('handleKeyboardEvent', event.key);
    this.interruptPromptModalService.close();
  }

  handleClose() {
    this.interruptPromptModalService.close();
  }

  handleSave() {
    this.interruptPromptModalService.close();
    this.entryformService.interruptDocument("");
  }
}
