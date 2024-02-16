import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UserSessionService } from './user-session.service';
import { AssignedDataentryJobs } from '../interface/assigned-dataentryjobs.interface';
import { DataentryDocument } from '../interface/dataentry-document.interface';
import { OutputJobData } from '../interface/output-jobdata.interface';

@Injectable({
  providedIn: 'root'
})
export class DataentryApiService {

  private http = inject(HttpClient);
  private userSessionService = inject(UserSessionService);

  constructor() { }

  public getImage(imagePath: string): Observable<any> {
    const baseUrl = this.userSessionService.imageServiceAddress;
    const params = new HttpParams()
      .set('imagePath', btoa(imagePath));

    return this.http.get(`${baseUrl}/Images`, { responseType: "blob", params });
  }

  public getDocument(): Observable<DataentryDocument> {

    if(!this.userSessionService.selectedJob())
      throw new Error('selectedJob is not defined');

    const baseUrl = this.userSessionService.webServiceAddress;
    const params = new HttpParams()
      .set('opid', this.userSessionService.opid)
      .set('projectName', this.userSessionService.selectedJob()!.projectName)
      .set('processName', this.userSessionService.selectedJob()!.processName);

    console.log('getDocument params: ', params);
    return this.http.get<DataentryDocument>(`${baseUrl}/Documents`, { params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          //console.log('error in source. Details: ', err);
          throw 'error in source. Details: ' + err.error;
        }));
  }

  public getAssingedDataEntryJobs(): Observable<AssignedDataentryJobs> {
    const baseUrl = this.userSessionService.webServiceAddress;
    const params = new HttpParams()
      .set('opid', this.userSessionService.opid)
      .set('profileName', this.userSessionService.profileName);
    //console.log('getAssingedDataEntryJobs',params)
    return this.http.get<AssignedDataentryJobs>(`${baseUrl}/Jobs`, { params });
  }

  public saveDocumentJobData(jobdata: OutputJobData): Observable<any> {
    const baseUrl = this.userSessionService.webServiceAddress;
    return this.http.post(`${baseUrl}/Documents`, jobdata);
  }
}
