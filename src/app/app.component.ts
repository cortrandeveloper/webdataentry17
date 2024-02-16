import { Component, HostListener, effect, inject } from '@angular/core';
import { UserSessionService } from './entry/services/user-session.service';
import { QueryParams } from './entry/interface/query-params.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dataentryApp';

  public userSessionService = inject(UserSessionService);

  @HostListener('window:beforeunload', ['$event'])
  handleClose(e: BeforeUnloadEvent): void {
    e.preventDefault();
    e.returnValue = 'handle';
  }

  constructor() {

    const queryParams: QueryParams = {
      opid: '3299',
      profile: 'CRLMEX',
      webServiceAddress: 'http://localhost:5151/api',
      imageServiceAddress: 'http://localhost:5151/api',
      isAuditTrail: false,
    };

    this.userSessionService.setQueryParams(queryParams);
  }
}
