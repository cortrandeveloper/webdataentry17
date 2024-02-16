import { FieldData, JobDataInfo, PageData } from './../interface/output-jobdata.interface';
import { Injectable, inject } from '@angular/core';
//import { RootLayout } from '../interface/crl01.interface';
import { RootLayout } from '../interface/entry-layout.interface';
import crl01layoutExample from '../mocks/crl01-json';
import { DocumentInfo } from '../interface/document-info.interface';
import { OutputJobData, GroupData } from '../interface/output-jobdata.interface';
import { ControlInfo } from '../interface/control-info.interface';
import { crl01inputJobdataExample } from '../mocks/crl01-input'
import { InputJobData } from '../interface/input-jobdata.interface';
//import { DocumentParams } from '../interface/document-params.interface';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlType } from '../enums/control-type.enum';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  //private _documentParams?: DocumentParams = { currentBehavior: 'verify' };
  //private _documentInfo?: DocumentInfo;
  //
  private userSessionService = inject(UserSessionService);

  // get documentParams(): DocumentParams | undefined {

  //   return this._documentParams;
  // }

  // get documentInfo(): DocumentInfo | undefined {

  //   return this._documentInfo;
  // }

  // pullEntryDocument(): boolean {

  //   const layout = crl01layoutExample as RootLayout;
  //   const inputJobData = crl01inputJobdataExample as InputJobData;

  //   this._documentInfo = this.createDocumentInfo(layout, inputJobData);

  //   return this._documentInfo ? true : false;
  // }

  // createDocumentInfo(layout: RootLayout, inputJobData: InputJobData): DocumentInfo {

  //   return {
  //     dcn: 'CRL01',
  //     entryLayout: layout,
  //     inputJobData: inputJobData
  //   };
  // }

  createJobdata(controls: ControlInfo[], routePath: string, statusDocument: string): OutputJobData | undefined {

    const document = this.userSessionService.currentDataentryDocument();
    const selectedJob = this.userSessionService.selectedJob();

    if (!document || !selectedJob)
      return undefined;

    const entryLayout = this.userSessionService.dataentryLayout;
    const currentJobData: OutputJobData = {
      Name: 'CRL01',
      PageDatas: [],
      JobDataInfo: {
        BatchName: document.batchName, //replace this one by batch name
        Customer: '', //leave it empty
        DateTimeIn: 'DateTimeIn', //replace this one by datetimein
        DateTimeOut: 'DateTimeOut', //replace this one by datetimeout
        DCN: document.documentNumber,
        DocumentClosedByFlag: false, //replace this one by document closed by flag
        DocumentFlagMessage: null, //replace this one by document flag message
        DocumentsCount: 0, //replace this one by documents count
        ElapsedTime: 0, //replace this one by elapsed time
        IpAddress: '', //leave it empty
        Job: selectedJob.projectName,
        KeyGross: 0, //replace this one by key gross
        KeyNet: 0, //replace this one by key net
        LinesCount: 0, //replace this one by lines count
        MachineName: '', //leave it empty
        MachineUser: '', //leave it empty
        OPID: this.userSessionService.opid,
        PauseTime: 0, //replace this one by pause time
        Process: selectedJob.processName,
        ReferenceID: parseInt(document.referenceID), //replace this one by reference id
        RoutePath: routePath,
        SessionId: document.sessionID,
        Status: statusDocument,
        Version: 'v2'
      }
    };

    entryLayout.PageLayout.forEach((page) => {
      const currentPageData: PageData = { IsNewElement: true, Name: page.Name, GroupDatas: [] };
      page.GroupLayout.forEach((group) => {
        const currentGroupData: GroupData = { IsNewElement: true, Name: group.Name, Fields: [] };
        group.ItemLayout.forEach((item) => {
          const currentControlInfo = controls.find((control) => control.name === item.Name);

          if (!currentControlInfo)
            throw new Error(`ControlInfo with name ${item.Name} is not defined`);

          const currentFieldData = this.createFieldData(currentControlInfo);
          currentGroupData.Fields?.push(currentFieldData);
        });
        currentPageData.GroupDatas.push(currentGroupData);
      });
      currentJobData.PageDatas?.push(currentPageData);
    });

    return currentJobData;
  }

  createFieldData(controlInfo: ControlInfo): FieldData {

    const { controlState, controlInput } = controlInfo;

    return {
      //CurrentPosition:  null,
      //LocationInfo?:    null,
      FlagMessage: null,
      //InputData?:       null,
      IsNewElement: false,
      KeyGross: controlState.keyGross,
      KeyNet: controlState.keyNet,
      Name: controlInfo.name,
      OPID: controlState.keyedBy || 'NotOpidProvided',
      PageIndex: 0, //Replace this one by imageindex
      SessionID: 'sessionId',
      Status: controlState.status,
      Type: 'textbox',
      Value: this.getControlVaue(controlInfo),
      //Zoom?:            string
    };
  }

  private getControlVaue(controlInfo: ControlInfo): string {

    const { controlInput, controlState, controlLayout } = controlInfo;

    if (controlLayout.Model === ControlType.OptionBox) {
      return this.getOptionBoxValue(controlInfo);
    }

    var control = controlInput as FormControl;
    return control.value;
  }
  private getOptionBoxValue(controlInfo: ControlInfo): string {

    const { controlInput, controlState, controlLayout } = controlInfo;

    const formGroup = controlInput as FormGroup;
    const formArray = formGroup.controls['items'] as FormArray;
    const optionIndex = formArray.controls.findIndex((control) => {
      console.log('xx => ', control.value);
      return control.value === true;
    });

    if (optionIndex > -1 && controlLayout.OptionItems) {
      return controlLayout.OptionItems[optionIndex].value;
    }

    return '';
  }
}
