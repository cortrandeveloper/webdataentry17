import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, effect, inject } from '@angular/core';
import { EntryFormService } from 'src/app/entry/services/entry-form.service';
import { SavePromptModalService } from 'src/app/entry/services/save-prompt-modal.service';

@Component({
  selector: 'entry-save-prompt-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './save-prompt-modal.component.html',
  styleUrl: './save-prompt-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavePromptModalComponent implements AfterViewInit {

  @ViewChild('saveButton') saveButton!: ElementRef;;
  private savePromptModalService = inject(SavePromptModalService);
  private entryformService = inject(EntryFormService);

  constructor() {
    effect(() => {
      if (this.savePromptModalService.isOpen()) {

        this.saveButton.nativeElement.focus();
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

    if (!this.savePromptModalService.isOpen()) return;

    console.log('handleKeyboardEvent', event.key);
    this.savePromptModalService.close();
  }

  handleClose() {
    this.savePromptModalService.close();
  }

  handleSave() {
    this.savePromptModalService.close();
    this.entryformService.saveDocument("HOLA PERROW");
  }
}
