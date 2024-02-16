import { ContentChildren, Injectable, QueryList, Signal, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

import { AnnonItemLayout, GroupLayout, ItemLayout, PageLayout, RootLayout } from '../interface/entry-layout.interface';
import { ControlInfo } from '../interface/control-info.interface';
import { InputFieldData, InputValue } from '../interface/input-jobdata.interface';

import { DataentryApiService } from './dataentry-api.service';
import { DocumentService } from './document.service';
import { ImageService } from './image.service';
import { NotificationBarService } from './notification-bar.service';
import { SavePromptModalService } from './save-prompt-modal.service';
import { UserSessionService } from './user-session.service';

import { ControlStatus } from '../enums/control-status.enum';
import { ControlType } from '../enums/control-type.enum';
import { IfNotMatch } from '../enums/if-not-match.enum';
import { KeyType } from '../enums/key-type.enum';
import { ValidationBehaviorResult } from '../enums/validation-behavior-result.enum';
import { ValidationType } from '../enums/validation-type.enum';

@Injectable({
  providedIn: 'root'
})
export class EntryFormService {
  //Angular Services
  private fb = inject(FormBuilder);
  private userSessionService = inject(UserSessionService);
  private dataentryApiService = inject(DataentryApiService);
  private documentService = inject(DocumentService);
  private notificationBarService = inject(NotificationBarService);
  private imageService = inject(ImageService);
  public savePromptModalService = inject(SavePromptModalService);
  //
  private _entryControlFlow: ControlInfo[] = [];
  private _editKeys: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  private _inputJobdataKeys: { [key: string]: InputFieldData } = {};

  public entryLayout?: RootLayout;
  public entryFormControls = this.fb.group({});
  public dictionaryRecord: Record<string, string> = {};
  public dictionaryMap = new Map<string, number>();
  public currentControlInfo = signal<ControlInfo | undefined>(undefined);
  public currentControlInfoIndex = signal<number>(-1);
  private documentSubject = new Subject<any>();

  get documentAction$() {
    return this.documentSubject.asObservable();
  }

  saveDocument(data: any) {
    this.createJobdata('Completed', '2');
    this.documentSubject.next('save');
  }

  interruptDocument(data: any) {
    this.createJobdata('Interrupt', '3');
    //this.documentSubject.next('interrupt');
  }

  constructor() { }

  get entryControls(): ControlInfo[] {

    return this._entryControlFlow;
  }

  get inputJobDataFields(): { [key: string]: InputFieldData } {

    return this._inputJobdataKeys;
  }

  // public pullEntryDocument(): boolean {

  //   return this.documentService.pullEntryDocument();
  // }

  public prepareInputJobdata(): boolean {

    const document = this.userSessionService.currentDataentryDocument();

    console.log('0prepareInputJobdata ', document);
    const { inputJobData } = this.userSessionService.currentDataentryDocument() || {};

    console.log('1prepareInputJobdata ', inputJobData );
    if (!inputJobData) {
      console.log('2prepareInputJobdata ', 'No inputJobData');
      return false;
    }
    inputJobData.PageDatas.forEach((page) => {
      page.GroupDatas.forEach((group) => {
        group.Fields.forEach((field) => {

          this._inputJobdataKeys[field.Name] = field;
        });
      });
    });

    return true;

  }
  public createJobdata(routePath: string, statusDocument: string): void {

    const jobdata = this.documentService.createJobdata(this.entryControls, routePath, statusDocument);

    if (!jobdata) return;

    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.log(JSON.stringify(jobdata));

    this.dataentryApiService.saveDocumentJobData(jobdata)
      .subscribe((response) => {
        console.log('createJobdata ', response);
      });
  }

  public clearEntryForm(): void {
    console.log('clearEntryForm', this.entryFormControls)
    this.entryLayout = undefined;
    this.entryFormControls.reset();
  }

  public loadLayout(): void {

    const layout = this.userSessionService.dataentryLayout;

    layout?.PageLayout.forEach((page) => {
      page.GroupLayout.forEach((group) => {
        group.ItemLayout.forEach((item) => {

          this.createOptionItems(item);
          // this.setItemPosition(item);
          // this.setItemDimension(item);
          this.setBehavior(layout, page, group, item);
          this.setZone(group, item);
          // this.setZoneHighlight(item);
        });
        // group.AnnonItemLayout.forEach((item) => {

        //   this.setItemPosition(item);
        //   this.setItemDimension(item);
        // });
      });
    });


    this.entryLayout = layout;
    console.log('EntryFormService ', ' loadLayout ', this.entryLayout);
    //console.log('DocumentInfo ', ' loadLayout ', this.documentService.currentDocumentInfo);
  }

  private createOptionItems(item: ItemLayout): void {

    if (item.Model !== ControlType.OptionBox && item.Model !== ControlType.ListBox) return;

    item.OptionItems = [];

    item.DataSource?.split('\n').forEach(line => {
      const [value, key] = line.split('-');
      item.OptionItems?.push({ name: key, value: value, fullName: line });
    });
  }

  // private setItemPosition(item: ItemLayout | AnnonItemLayout): void {

  //   const { firstPos: x, secondPos: y } = this.convertStringToPoint(item.Position);
  //   item.PositionX = x;
  //   item.PositionY = y;
  // }

  // private setItemDimension(item: ItemLayout | AnnonItemLayout): void {

  //   const { firstPos: width, secondPos: height } = this.convertStringToPoint(item.Dimension);
  //   item.DimensionWidth = width;
  //   item.DimensionHeight = height;
  // }

  private setBehavior(layout: RootLayout, page: PageLayout, group: GroupLayout, item: ItemLayout): void {

    if (item.Behavior.length > 0) return;

    if (group.Behavior.length > 0) {
      item.Behavior = group.Behavior;
      return;
    }

    if (page.Behavior.length > 0) {
      item.Behavior = page.Behavior;
      return;
    }

    if (layout.Behavior.length > 0) {
      item.Behavior = layout.Behavior;
      return;
    }

  }

  // private setZone(group: GroupLayout, item: ItemLayout): void {

  //   if (item.Zone.length == 0 && group.Zone.length == 0) return;

  //   if (item.Zone.length > 0) {

  //     const coords = item.Zone.split(',');

  //     item.ZoneRect = {
  //       x: parseFloat(coords[0]),
  //       y: parseFloat(coords[1]),
  //       w: parseFloat(coords[2]),
  //       h: parseFloat(coords[3])
  //     }

  //     return;
  //   }

  //   if (group.Zone.length > 0) {

  //     const coords = group.Zone.split(',');

  //     item.ZoneRect = {
  //       x: parseFloat(coords[0]),
  //       y: parseFloat(coords[1]),
  //       w: parseFloat(coords[2]),
  //       h: parseFloat(coords[3])
  //     }
  //     return;
  //   }
  // }

  private setZone(group: GroupLayout, item: ItemLayout): void {

    if (item.Zone) return;
    if (!group.Zone) return;

    item.Zone = group.Zone;
  }

  // private setZoneHighlight(item: ItemLayout): void {

  //   if (item.ZoneHighlight.length == 0) return;

  //   const coords = item.ZoneHighlight.split(',');

  //   item.ZoneHighlightRect = {
  //     x: parseFloat(coords[0]),
  //     y: parseFloat(coords[1]),
  //     w: parseFloat(coords[2]),
  //     h: parseFloat(coords[3])
  //   }
  // }

  // private convertStringToPoint(pointString: string): { firstPos: number, secondPos: number } {

  //   console.log('convertStringToPointx ', pointString);
  //   const pointArray = pointString.split(',');
  //   console.log('convertStringToPointy ', pointArray);
  //   return { firstPos: parseInt(pointArray[0]), secondPos: parseInt(pointArray[1]) };
  // }

  public createForm(): void {

    let entryControls: ControlInfo[] = [];

    this.entryLayout?.PageLayout.forEach((page) => {
      page.GroupLayout.forEach((group) => {
        group.ItemLayout.forEach((item) => {
          const controlInput = this.createEntryFormControl(item);
          const controlInfo = this.createControlInfo(item, controlInput);
          // this._entryControlFlow.push(controlInfo);
          entryControls.push(controlInfo);
        });
      });
    });

    this._entryControlFlow = entryControls;
  }

  public createControlInfo(itemLayout: ItemLayout, controlInput: FormControl<any> | FormGroup<any>): ControlInfo {

    if (!this.userSessionService.selectedJob())
      throw new Error('selectedJob is not defined');

    const currentBehavior = this.userSessionService.selectedJob()!.processName;
    const entryBehavior = itemLayout.Behavior.find((behavior) => behavior.Name.toLowerCase() === currentBehavior.toLowerCase());

    if (!entryBehavior) throw Error(`No behavior found`);

    return {
      name: itemLayout.Name,
      controlState: {
        keyNet: 0,
        keyGross: 0,
        status: ControlStatus.Pristine,
        previousValue: '',
        isReadOnly: itemLayout.ReadOnly
      },
      controlInput: controlInput,
      controlLayout: itemLayout,
      controlInputJobData: this.inputJobDataFields[itemLayout.Name],
      entryBehavior: entryBehavior
    };
  }

  public createEntryFormControl(itemLayout: ItemLayout): FormControl<any> | FormGroup<any> {

    const controlInput = this.createControlInput(itemLayout);
    this.entryFormControls.addControl(itemLayout.Name, controlInput);

    return controlInput;
  }

  private createControlInput(itemLayout: ItemLayout): FormControl | FormGroup {

    if (itemLayout.Model === ControlType.OptionBox) return new FormGroup({});

    return new FormControl('');
  }

  public setFlagCurrentControl(): void {
    console.log('setFlagCurrentControl');

    if (!this.currentControlInfo()) return;

    const controlInfo = this.currentControlInfo() as ControlInfo;

    if (controlInfo.controlState.status !== ControlStatus.Flagged) {
      this.setControlAsFlagged(controlInfo);
      this.moveToNextControl(controlInfo.name);
      return;
    }

    this.setControlAsValid(controlInfo);
    this.focusCurrentControlFlow();
    console.log('setFlagCurrentControl out');
  }

  public setControlFlowByIndex(index: number) {

    console.log('setControlFlowByIndex ', index);
    const controlInfo = this._entryControlFlow[index];

    if (controlInfo === undefined) return;

    const { controlLayout } = controlInfo;

    this.currentControlInfoIndex.set(index);
    this.currentControlInfo.set(controlInfo);
    this.notificationBarService.setInfoMessage(controlLayout.MessageInfo);
    document.getElementById(controlInfo.name)?.focus();
  }

  public setControlFlowByName(controlName: string) {

    console.log('setControlFlowByName ', controlName);
    const index = this._entryControlFlow.findIndex((control) => control.name.toLowerCase() === controlName.toLowerCase());
    const controlInfo = this._entryControlFlow[index];

    console.log('setControlFlowByName ', index, controlInfo);
    if (controlInfo === undefined) return;

    const { controlLayout } = controlInfo;

    this.currentControlInfoIndex.set(index);
    this.currentControlInfo.set(controlInfo);
    this.notificationBarService.setInfoMessage(controlLayout.MessageInfo);
    document.getElementById(controlInfo.name)?.focus();
  }

  public focusCurrentControlFlow() {

    const index = this.currentControlInfoIndex();

    if (index < 0) return;

    const controlFlow = this._entryControlFlow[index];

    if (!controlFlow) return;

    document.getElementById(controlFlow.name)?.blur();
    document.getElementById(controlFlow.name)?.focus();
    //document.getElementById(controlFlow.name)?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    document.getElementById(controlFlow.name)
      ?.parentElement
      ?.scrollIntoView(false);
  }

  public tryAutoSkip(event: any, controlInfo: ControlInfo): boolean {

    const { controlInput, controlLayout, controlState } = controlInfo;

    if (!controlLayout.AutoSkip)
      return false;

    if (!this.isKeyeableChar(event))
      return false;

    if (controlLayout.Model === ControlType.TextBox) {

      if (controlLayout.FieldLength !== controlInput.value.length)
        return false;

      return this.tryMoveToNextControl(event, controlInfo);
    }

    if (controlLayout.Model === ControlType.OptionBox || controlLayout.Model === ControlType.ListBox) {

      return this.tryMoveToNextControl(event, controlInfo);
    }

    return false;
  }

  public moveToFirstControl(): void {

    const { nextControlInfo, nextIndex } = this.getNextFocusableControl(-1);

    if (!nextControlInfo) {
      console.log('No hay control para enfocar');
      return;
    }

    console.log('Moving to: ', nextControlInfo.name);

    this.setControlFlowByIndex(nextIndex);
    this.setCanvasState(nextControlInfo);
  }

  public moveToControlByName(controlName: string): void {

    const { controlInfo, index } = this.getFocusableControl(controlName);

    if (!controlInfo) {
      console.log('No hay control para enfocar');
      return;
    }

    console.log('Moving to: ', controlInfo.name);

    this.setControlFlowByIndex(index);
    this.setCanvasState(controlInfo);
  }

  public moveToNextControl(currentControlName: string): void {

    const currentControlIndex = this._entryControlFlow.findIndex((control) => control.name === currentControlName);
    const { nextControlInfo, nextIndex } = this.getNextFocusableControl(currentControlIndex);

    if (!nextControlInfo) {
      console.log('No hay control para enfocar');
      this.savePromptModalService.open();
      return;
    }

    console.log('Moving to: ', nextControlInfo.name);

    this.setControlFlowByIndex(nextIndex);
    this.setCanvasState(nextControlInfo);
  }

  private setCanvasState(controlInfo: ControlInfo): void {

    const { controlLayout } = controlInfo;

    this.imageService.setCurrentZoneAndHighlight(controlLayout.Zone, controlLayout.ZoneHighlight);
  }

  private getFocusableControl(controlName: string): { controlInfo: ControlInfo | null, index: number } {

    const controlInfo = this._entryControlFlow.find((control) => control.name.toLowerCase() === controlName.toLowerCase());

    if (!controlInfo) return { controlInfo: null, index: -1 };

    if (controlInfo.controlState.isReadOnly)
      return { controlInfo: null, index: -1 };

    return { controlInfo: controlInfo, index: this._entryControlFlow.indexOf(controlInfo) };
  }

  private getNextFocusableControl(index: number): { nextControlInfo: ControlInfo | null, nextIndex: number } {

    const nextControlInfo = this._entryControlFlow[index + 1];

    if (!nextControlInfo) return { nextControlInfo: null, nextIndex: -1 };

    if (nextControlInfo.controlState.isReadOnly)
      return this.getNextFocusableControl(index + 1);

    return { nextControlInfo: nextControlInfo, nextIndex: index + 1 };
  }

  private getPreviousFocusableControl(index: number): { previousControlInfo: ControlInfo | null, previousIndex: number } {

    const previousControlInfo = this._entryControlFlow[index - 1];

    if (!previousControlInfo) return { previousControlInfo: null, previousIndex: -1 };

    if (previousControlInfo.controlState.isReadOnly)
      return this.getPreviousFocusableControl(index - 1);

    console.log('getPreviousFocusableControl ', previousControlInfo.name);
    return { previousControlInfo: previousControlInfo, previousIndex: index - 1 };
  }

  public moveToPreviousControl(currentControlName: string): void {

    const currentControlIndex = this._entryControlFlow.findIndex((control) => control.name === currentControlName);
    const { previousControlInfo, previousIndex } = this.getPreviousFocusableControl(currentControlIndex);

    if (!previousControlInfo) {
      console.log('No hay control para enfocar');
      return;
    }

    console.log('Moving to: ', previousControlInfo.name);
    this.setControlFlowByIndex(previousIndex);
    this.setCanvasState(previousControlInfo);
  }

  public tryMoveToNextControl(event: any, controlInfo: ControlInfo): boolean {

    const { controlInput, controlState } = controlInfo;
    const currentControlName = event?.target?.id;

    if (!currentControlName) return false;

    if (controlState.status === ControlStatus.Flagged) {
      this.moveToNextControl(currentControlName);
      event.preventDefault();
      return true;
    }

    if (controlState.status === ControlStatus.Rekey && this.isValidRekey(controlInfo)) {

      this.setControlAsKeyed(controlInfo);
      this.moveToNextControl(currentControlName);
      event.preventDefault();
      return true;
    }

    const validationBehaviorResult = this.validateBehaviorRules(controlInfo);

    if (validationBehaviorResult === ValidationBehaviorResult.Valid) {

      this.setControlAsKeyed(controlInfo);
      this.moveToNextControl(currentControlName);
      event.preventDefault();
      return true;
    }

    if (validationBehaviorResult === ValidationBehaviorResult.Invalid) {

      this.setControlAsInvalid(controlInfo);
      return false;
    }

    if (validationBehaviorResult === ValidationBehaviorResult.Rekey) {

      this.setControlAsReKey(controlInfo);
      return false;
    }

    return false;
  }

  private isValidRekey(controlInfo: ControlInfo): boolean {

    const { controlInput, controlState, controlLayout } = controlInfo;

    if (controlLayout.Model === ControlType.OptionBox) {

      const selectedValue = this.getOptionBoxValue(controlInfo);
      console.log('isValidRekey OptionBox: ', selectedValue, controlState.previousValue);
      return selectedValue === controlState.previousValue;
    }

    return controlInput.value === controlState.previousValue;
  }

  private getOptionBoxValue(controlInfo: ControlInfo): string {

    const { controlInput, controlState, controlLayout } = controlInfo;

    const formGroup = controlInput as FormGroup;
    const formArray = formGroup.controls['items'] as FormArray;
    const optionIndex = formArray.controls.findIndex(({ value }) => (value as boolean) === true);

    if (optionIndex > -1 && controlLayout.OptionItems) {
      return controlLayout.OptionItems[optionIndex].value;
    }

    return '';
  }

  private resetOptionBoxValues(controlInfo: ControlInfo): void {

    const { controlInput, controlState, controlLayout } = controlInfo;

    const formGroup = controlInput as FormGroup;
    const formArray = formGroup.controls['items'] as FormArray;
    formArray.controls.forEach((control) => {
      control.setValue(false);
    });

  }

  private validateBehaviorRules(controlInfo: ControlInfo): ValidationBehaviorResult {

    const { controlInput, controlLayout, entryBehavior } = controlInfo;

    const isValidExpression = this.isValidExpression(controlInput.value, controlLayout.ValidExpression);
    const isValidException = this.isValidException(controlInput.value, controlLayout.ValidException);

    if (entryBehavior.KeyType.Mode === KeyType.SingleKey) {

      return this.validateBehaviorSingleKey(controlInfo, isValidExpression, isValidException);
    }

    if (entryBehavior.KeyType.Mode === KeyType.Compare) {

      return this.validateBehaviorCompareKey(controlInfo, isValidExpression, isValidException);
    }

    return ValidationBehaviorResult.Invalid;
  }

  private validateBehaviorCompareKey(controlInfo: ControlInfo, isValidExpression: boolean, isValidException: boolean): ValidationBehaviorResult {

    // console.log('validateBehaviorCompareKey ', isValidExpression, isValidException);
    const { controlLayout, entryBehavior } = controlInfo;

    if (this.isValidInputData(controlInfo)) return ValidationBehaviorResult.Valid;

    if (controlLayout.ValidadationType === ValidationType.Hard && !isValidExpression && !isValidException) {

      return ValidationBehaviorResult.Invalid;
    }

    // console.log('validateBehaviorCompareKey ', entryBehavior.KeyType.IfNotMatch);
    if (entryBehavior.KeyType.IfNotMatch === IfNotMatch.DoubleKey) return ValidationBehaviorResult.Rekey;
    if (entryBehavior.KeyType.IfNotMatch === IfNotMatch.Prompt) return ValidationBehaviorResult.Prompt;


    return ValidationBehaviorResult.Valid;
  }

  private validateBehaviorSingleKey(controlInfo: ControlInfo, isValidExpression: boolean, isValidException: boolean): ValidationBehaviorResult {

    // console.log('validateBehaviorSingleKey ', isValidExpression, isValidException);
    const { controlLayout } = controlInfo;

    if (controlLayout.ValidadationType === ValidationType.None) return ValidationBehaviorResult.Valid;
    if (isValidExpression) return ValidationBehaviorResult.Valid;

    if (controlLayout.ValidadationType === ValidationType.Hard && isValidException) {
      return ValidationBehaviorResult.Rekey;
    }

    return ValidationBehaviorResult.Invalid;
  }

  private setControlAsKeyed(controlInfo: ControlInfo): void {

    const { controlState } = controlInfo;

    controlState.status = ControlStatus.Keyed;
    this.notificationBarService.setInfoMessage(null);
  }

  private setControlAsValid(controlInfo: ControlInfo): void {

    const { controlInput, controlState, controlLayout } = controlInfo;

    //controlInput.setValue('');
    //controlInput.enable();
    controlState.status = ControlStatus.Valid;
    this.notificationBarService.setInfoMessage(controlLayout.MessageInfo);
  }

  private setControlAsInvalid(controlInfo: ControlInfo): void {

    const { controlInput, controlLayout, controlState } = controlInfo;

    controlState.status = ControlStatus.Invalid;
    controlState.previousValue = controlInput.value;
    controlInput.setValue('');
    this.notificationBarService.setErrorMessage(controlLayout.ValidationMessage);
  }

  private setControlAsReKey(controlInfo: ControlInfo): void {
    console.log('setControlAsReKey', controlInfo);
    const { controlInput, controlState, controlLayout } = controlInfo;

    controlState.status = ControlStatus.Rekey;

    if (controlLayout.Model === ControlType.OptionBox) {

      controlState.previousValue = this.getOptionBoxValue(controlInfo);
      this.resetOptionBoxValues(controlInfo);
      this.notificationBarService.setErrorMessage('Re-key to confirm');
      console.log('setControlAsReKey Optionbox ', controlState.previousValue);
      return;
    }

    controlState.previousValue = controlInput.value;
    controlInput.setValue('');
    this.notificationBarService.setErrorMessage('Re-key to confirm');
  }

  private setControlAsFlagged(controlInfo: ControlInfo): void {
    console.log('setControlAsFlagged', controlInfo);
    const { controlInput, controlState, controlLayout } = controlInfo;

    controlState.status = ControlStatus.Flagged;

    if (controlLayout.Model === ControlType.OptionBox) {

      controlState.previousValue = '';
      this.resetOptionBoxValues(controlInfo);
      return;
    }

    controlState.previousValue = '';
    controlInput.setValue('');
    //this.notificationBarService.setErrorMessage('Re-key to confirm');
  }

  public tryMoveToPreviousControl(event: any): boolean {

    const currentControlName = event?.target?.id;

    if (!currentControlName) return false;

    this.moveToPreviousControl(currentControlName);
    event.preventDefault();
    return true;
  }

  isEditKey(event: any): boolean {

    const { key } = event;

    if (this._editKeys.includes(key))
      return true;

    return false;
  }

  isKeyeableChar(event: any): boolean {

    const { keyCode, altKey, ctrlKey, shiftKey } = event;

    if (altKey || ctrlKey || shiftKey) return false;
    //numbers and letters
    if (keyCode >= 48 && keyCode <= 90) return true;
    //comma, period, apostrophe
    if (keyCode === 188 && keyCode === 190 && keyCode === 222) return true;

    return false;
  }

  isValidChar(char: string | undefined, regexValidation: string | undefined): boolean {

    if (!regexValidation || !char)
      return true;

    const regex = new RegExp(regexValidation);
    return regex.test(char);
  }

  isValidExpression(content: string | undefined, regexValidation: string | undefined): boolean {

    if (!regexValidation || !content)
      return true;

    const regex = new RegExp(regexValidation);
    return regex.test(content);
  }

  isValidException(content: string | undefined, regexValidation: string | undefined): boolean {

    if (!regexValidation || !content)
      return false;

    const regex = new RegExp(regexValidation);
    return regex.test(content);
  }

  isValidInputData(controlInfo: ControlInfo): boolean {

    const { controlInput, controlInputJobData, controlLayout } = controlInfo;

    let currentValue = '';
    let inputValue: InputValue | undefined;

    if (controlLayout.Model === ControlType.OptionBox) {

      currentValue = this.getOptionBoxValue(controlInfo);
      inputValue = controlInputJobData.Values.find((value) => value.Content.split('-')[0].toLowerCase() === currentValue.toLowerCase());
    }
    else if (controlLayout.Model === ControlType.ListBox) {

      currentValue = controlInput.value;
      inputValue = controlInputJobData.Values.find((value) => value.Content.toLowerCase() === currentValue.toLowerCase());
      // console.log(controlInputJobData.Values);
      // console.log('isValidInputData ListBox ', currentValue, ' <.> ' ,inputValue);
    }
    else {

      currentValue = controlInput.value;
      inputValue = controlInputJobData.Values.find((value) => value.Content.toLowerCase() === currentValue.toLowerCase());
    }

    //console.table(controlInputJobData.Values);
    if (!inputValue) return false;

    return true;
  }
}
