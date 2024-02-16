import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ControlInfo } from '../../../interface/control-info.interface';
import { FormControl } from '@angular/forms';
import { ControlState } from '../../../interface/control-state.interface';
import { ItemLayout } from '../../../interface/entry-layout.interface';
import { OptionItem } from '../../../interface/option-item.interface';
import { EntryFormService } from '../../../services/entry-form.service';
import { NotificationBarService } from '../../../services/notification-bar.service';
import { ControlStatus } from 'src/app/entry/enums/control-status.enum';

@Component({
  selector: 'entry-listbox-control',
  templateUrl: './listbox-control.component.html',
  styleUrls: ['./listbox-control.component.css']
})
export class ListboxControlComponent implements OnInit {
  private entryFormService = inject(EntryFormService);
  private notificationBarService = inject(NotificationBarService);

  @ViewChild('listControl') listControl!: ElementRef;
  @Input() controlInfo!: ControlInfo;

  //public optionList: OptionItem[] = [];
  public dropdownVisibility: string = 'invisible';

  ngOnInit(): void {
    // this.createOptionList();
  }

  // private createOptionList() {
  //   this.controlLayout.DataSource?.split('\n').forEach(line => {
  //     const [value, key] = line.split('-');
  //     this.optionList.push({ name: key, value: value, fullName: line });
  //   });

  //   return this.optionList;
  // }

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

    return this.entryFormService.tryAutoSkip(event, this.controlInfo);
  }

  private trySetOption(event: any): boolean {

    event.preventDefault();

    if (this.isNonKeyableState()) return false;

    if (!this.entryFormService.isKeyeableChar(event) || !this.isValidChar(event)) return false;

    if(!this.controlLayout.OptionItems) return false;

    const index = this.controlLayout.OptionItems
      .findIndex(option => option.value.toLowerCase() == event.key.toLowerCase()) ?? -1;

    if (index > -1) {
      const selectedOption = this.controlLayout.OptionItems[index];
      this.controlInput.setValue(selectedOption.fullName);
      return true;
    }

    return false;
  }

  public onFocus(event: any) {

    if (this.isNonKeyableState()) return;

    this.dropdownVisibility = 'visible';
  }

  public onBlur(event: any) {
    this.dropdownVisibility = 'invisible';
  }

  //   @HostListener('keydown', ['$event'])
  //   private onKeyDownControl(event: any): void {

  //     if (event.repeat) return;

  //     console.log('listbox-onKeyDownControl ', this.controlLayout.Name, { event });

  //     if (this.isEditKey(event)) return;

  // //    this.trySetOption(event);
  //   }

  //   @HostListener('keyup', ['$event'])
  //   private onKeyUpControl(event: any): void {

  //     if (event.repeat) return;

  //     console.log('listbox-onKeyUpControl ', this.controlLayout.Name, { event });

  //     if (this.trySetOption(event)) {
  //       this.tryAutoSkip(event);
  //       return;
  //     }

  //     if (this.tryMoveToNextControl(event)) return;
  //     if (this.tryMoveToPreviousControl(event)) return;
  //   }

  //@HostListener('keydown', ['$event'])
  public onKeyDown(event: any): void {

    if (event.repeat) return;

    // console.log('textbox-onKeyDownControl ', this.controlLayout.Name, { event });

    if (this.isEditKey(event)) return;

    // this.preventInvalidChar(event);
  }

  //@HostListener('keyup', ['$event'])
  public onKeyUp(event: any): void {

    if (event.repeat) return;

    // console.log('textbox-onKeyUpControl ', this.controlLayout.Name, { event });

    if (this.trySetOption(event)) {
      this.tryAutoSkip(event);
      return;
    }

    if (this.tryMoveToNextControl(event)) return;
    if (this.tryMoveToPreviousControl(event)) return;
  }

}
