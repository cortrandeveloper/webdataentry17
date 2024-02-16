import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { ItemLayout } from '../../../interface/entry-layout.interface';
import { FormControl } from '@angular/forms';
import { EntryFormService } from '../../../services/entry-form.service';
import { NotificationBarService } from '../../../services/notification-bar.service';
import { ControlState } from '../../../interface/control-state.interface';
import { ControlInfo } from '../../../interface/control-info.interface';

@Component({
  selector: 'entry-textbox-control',
  templateUrl: './textbox-control.component.html',
  styleUrls: ['./textbox-control.component.css']
})
export class TextboxControlComponent implements OnInit {

  private entryFormService = inject(EntryFormService);
  private notificationBarService = inject(NotificationBarService);

  @Input() controlInfo!: ControlInfo;

  ngOnInit(): void {

    if (this.controlState.isReadOnly)
      this.controlInput.disable();
  }

  get controlInput(): FormControl {
    return this.controlInfo.controlInput as FormControl;
  }

  get controlState(): ControlState {
    return this.controlInfo.controlState;
  }

  get controlLayout(): ItemLayout {
    return this.controlInfo.controlLayout;
  }

  private tryMoveToNextControl(event: any): boolean {

    const { ctrlKey, altKey, shiftKey, key } = event;

    if (!ctrlKey && !altKey && !shiftKey && key === 'Enter') {
      return this.entryFormService.tryMoveToNextControl(event, this.controlInfo);
    }
    return false;
  }

  private tryMoveToPreviousControl(event: any): boolean {

    const { ctrlKey, altKey, shiftKey, key } = event;

    if (!ctrlKey && !altKey && shiftKey && key === 'Enter') {
      return this.entryFormService.tryMoveToPreviousControl(event);
    }
    return false;
  }

  private isEditKey(event: any): boolean {

    return this.entryFormService.isEditKey(event);
  }

  private preventInvalidChar(event: any): void {

    if (!this.entryFormService.isValidChar(event.key, this.controlLayout.ValidChars)) {

      console.log('textbox-isValidChar ', event.key, this.controlLayout.ValidChars);
      event.preventDefault();
    }

  }

  private tryAutoSkip(event: any): boolean {

    return this.entryFormService.tryAutoSkip(event, this.controlInfo);
  }

  public onFocus(event: any) {

   // this.notificationBarService.setInfoMessage(this.controlLayout.MessageInfo);
  }

  //@HostListener('keydown', ['$event'])
  public onKeyDown(event: any): void {

    if (event.repeat) return;

    // console.log('textbox-onKeyDownControl ', this.controlLayout.Name, { event });

    if (this.isEditKey(event)) return;

    this.preventInvalidChar(event);
  }

  //@HostListener('keyup', ['$event'])
  public onKeyUp(event: any): void {

    if (event.repeat) return;

    // console.log('textbox-onKeyUpControl ', this.controlLayout.Name, { event });

    if (this.tryMoveToNextControl(event)) return;
    if (this.tryMoveToPreviousControl(event)) return;

    this.tryAutoSkip(event);
  }
}
