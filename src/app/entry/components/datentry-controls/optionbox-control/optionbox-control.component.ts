import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { ControlState } from '../../../interface/control-state.interface';
import { ControlStatus } from '../../../enums/control-status.enum';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ItemLayout } from '../../../interface/entry-layout.interface';
import { NotificationBarService } from '../../../services/notification-bar.service';
import { EntryFormService } from '../../../services/entry-form.service';
import { OptionItem } from '../../../interface/option-item.interface';
import { ControlInfo } from '../../../interface/control-info.interface';

@Component({
  selector: 'entry-optionbox-control',
  templateUrl: './optionbox-control.component.html',
  styleUrls: ['./optionbox-control.component.css']
})
export class OptionboxControlComponent implements OnInit {
  private entryFormService = inject(EntryFormService);
  private notificationBarService = inject(NotificationBarService);

  @Input() controlInfo!: ControlInfo;
  //public optionList: OptionItem[] = [];

  ngOnInit() {
    //this.createOptionList();
    this.controlInput.addControl('items', new FormArray([]));

    this.controlLayout.OptionItems?.forEach(() =>
      this.controlItems.push(new FormControl())
    );
  }

  // private createOptionList() {

  //   this.controlLayout.DataSource?.split('\n').forEach(line => {
  //     const [value, key] = line.split('-');
  //     this.optionList.push({ name: key, value: value, fullName: line });
  //   });

  //   return this.optionList;
  // }

  get controlInput(): FormGroup {
    return this.controlInfo.controlInput as FormGroup;
  }

  get controlState(): ControlState {
    return this.controlInfo.controlState;
  }

  get controlLayout(): ItemLayout {
    return this.controlInfo.controlLayout;
  }

  get controlItems() {
    return this.controlInput.get('items') as FormArray;
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

  private isNonKeyableState(): boolean {

    const { controlState, controlLayout } = this.controlInfo;


    if (controlState.status == ControlStatus.Flagged || controlLayout.ReadOnly) return true;

    return false;
  }

  private isEditKey(event: any): boolean {

    return this.entryFormService.isEditKey(event);
  }

  private isValidChar(event: any): boolean {

    return this.entryFormService.isValidChar(event.key, this.controlLayout.ValidChars);
  }

  private tryAutoSkip(event: any): boolean {

    if (this.isNonKeyableState()) {
      event.preventDefault();
      return false;
    }

    return this.entryFormService.tryAutoSkip(event, this.controlInfo);
  }

  private trySetOption(event: any): boolean {

    event.preventDefault();

    if (this.isNonKeyableState()) return false;

    if (!this.entryFormService.isKeyeableChar(event) || !this.isValidChar(event)) return false;

    const index = this.controlLayout.OptionItems?.
      findIndex(option => option.value.toLowerCase() == event.key.toLowerCase()) ?? -1;

    if (index > -1) {

      if (!this.controlLayout.MultiOption) {
        this.controlItems.controls.forEach((control) => control.setValue(false));
      }

      this.controlItems.controls[index].setValue(true);
      return true;
    }

    console.log('optionbox-trySetOptionControl-InvalidOption ', this.controlLayout.Name, { event })

    return false;
  }

  public onFocus(event: any) {
    //restore this.notificationBarService.setInfoMessage(this.controlLayout.MessageInfo);
  }

  //@HostListener('keydown', ['$event'])
  public onKeyDown(event: any): void {

    if (event.repeat) return;

    console.log('optionbox-onKeyDownControl ', this.controlLayout.Name, { event });

    if (this.isEditKey(event)) return;
  }

  //@HostListener('keyup', ['$event'])
  public onKeyUp(event: any): void {

    if (event.repeat) return;

    console.log('optionbox-onKeyUpControl ', this.controlLayout.Name, { event });

    if (this.trySetOption(event)) {
      this.tryAutoSkip(event);
      return;
    }

    if (this.tryMoveToNextControl(event)) return;
    if (this.tryMoveToPreviousControl(event)) return;
  }

}
