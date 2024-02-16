import { Injectable, computed, signal } from '@angular/core';
import { QueryParams } from '../interface/query-params.interface';
import { JobParams } from '../interface/job-params.interface';
import { DataentryDocument } from '../interface/dataentry-document.interface';
import { AssignedDataentryJobs, Job, Layout } from '../interface/assigned-dataentryjobs.interface';
import { RootLayout } from '../interface/entry-layout.interface';
import { InputJobData } from '../interface/input-jobdata.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private _queryParams?: QueryParams;
  private _jobParams = signal<JobParams | undefined>(undefined);
  private _dataentryDocument = signal<DataentryDocument | undefined>(undefined);
  private _assignedDataentryJobs?: AssignedDataentryJobs;

  public setQueryParams(queryParams: QueryParams | undefined) {
    this._queryParams = queryParams;
  }

  public setJobParams(jobParams: JobParams | undefined) {
    this._jobParams.set(jobParams);
  }

  public setDataentryDocument(dataentryDocument: DataentryDocument | undefined) {
    this._dataentryDocument.set(dataentryDocument);
  }

  public currentDataentryDocument = computed(this._dataentryDocument);

  public setAssignedDataentryJobs(assignedDataentryJobs: AssignedDataentryJobs) {
    this._assignedDataentryJobs = assignedDataentryJobs;
  }

  public get assignedJobs(): Job[] {

    if (!this._assignedDataentryJobs)
      return [];

    return [...this._assignedDataentryJobs.jobs];
  }

  public get dataentryLayout(): RootLayout {

    if (!this._assignedDataentryJobs)
      throw new Error('AssignedDataentryJobs is not defined');

    const result = this._assignedDataentryJobs?.layouts.find((layout: Layout) => {
      return layout.layoutName === this.selectedJob()?.layoutName
    });

    if (!result)
      throw new Error('Layout is not defined');

    return JSON.parse(result.layout);
  }

  public get opid(): string {

    if (!this._queryParams)
      throw new Error('QueryParams is not defined');

    return this._queryParams.opid;
  }

  public get webServiceAddress(): string {

    if (!this._queryParams)
      throw new Error('QueryParams is not defined');

    return this._queryParams.webServiceAddress;
  }

  public get imageServiceAddress(): string {

    if (!this._queryParams)
      throw new Error('QueryParams is not defined');

    return this._queryParams.imageServiceAddress;
  }

  public selectedJob = computed(this._jobParams);

  // public get processName(): string {

  //   if (!this._jobParams)
  //     throw new Error('QueryParams is not defined');

  //   return this._jobParams.processName;
  // }

  // public get projectName(): string {

  //   if (!this._jobParams)
  //     throw new Error('QueryParams is not defined');

  //   return this._jobParams.projectName;
  // }

  // public get behaviorName(): string {

  //   if (!this._jobParams)
  //     throw new Error('QueryParams is not defined');

  //   return this._jobParams.processName;
  // }

  // public get layoutName(): string {

  //   if (!this._jobParams)
  //     throw new Error('QueryParams is not defined');

  //   return this._jobParams.layoutName;
  // }

  public get profileName(): string {

    if (!this._queryParams)
      throw new Error('QueryParams is not defined');

    return this._queryParams.profile;
  }
}
