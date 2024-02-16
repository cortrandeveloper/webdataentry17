import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { UserSessionService } from '../../services/user-session.service';
import { DataentryApiService } from '../../services/dataentry-api.service';
import { JobParams } from '../../interface/job-params.interface';
import { Job } from '../../interface/assigned-dataentryjobs.interface';

@Component({
  // selector: 'app-assigned-jobs',
  // standalone: true,
  // imports: [
  //   CommonModule,
  // ],
  templateUrl: './assigned-jobs-page.component.html',
  styleUrl: './assigned-jobs-page.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignedJobsPageComponent implements OnInit {

  private userSessionService = inject(UserSessionService);
  private dataentryApiService = inject(DataentryApiService);

  ngOnInit(): void {
    this.getAssignedDataEntryJobs();
  }

  get assignedJobs() {
    return this.userSessionService.assignedJobs;
  }

  get opid() {
    return this.userSessionService.opid;
  }

  getAssignedDataEntryJobs(): void {
    this.dataentryApiService.getAssingedDataEntryJobs()
      .subscribe((assignedDataentryJobs) => {
        console.log('AssignedDataentryJobs: ', assignedDataentryJobs);
        this.userSessionService.setAssignedDataentryJobs(assignedDataentryJobs);
      });
  }
}
