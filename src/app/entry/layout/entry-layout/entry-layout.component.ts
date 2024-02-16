import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { NotificationBarService } from '../../services/notification-bar.service';
import { UserSessionService } from '../../services/user-session.service';
import { InterruptPromptModalService } from '../../services/interrupt-prompt-modal.service';
import { OptionModalService } from '../../services/option-modal.service';
import { EntryFormService } from '../../services/entry-form.service';
import { SavePromptModalService } from '../../services/save-prompt-modal.service';
import { MenuModalService } from '../../services/menu-modal.service';

@Component({
  templateUrl: './entry-layout.component.html',
  styleUrls: ['./entry-layout.component.css']
})
export class EntryLayoutComponent implements OnInit {

  private notificationBarService = inject(NotificationBarService);
  public notificationMessage = computed(this.notificationBarService.notificationMessage);
  public notificationCss = computed(this.notificationBarService.notificationCss);

  private userSessionService = inject(UserSessionService);

  private dataentryDocument = computed(()=> this.userSessionService.currentDataentryDocument());
  public opid = computed(()=> this.userSessionService.opid);
  public jobName = computed(()=> this.userSessionService.selectedJob()?.projectName);
  public processName = computed(()=> this.userSessionService.selectedJob()?.processName);
  public batchName = computed(()=> this.dataentryDocument()?.batchName);
  public documentNumber = computed(()=> this.dataentryDocument()?.documentNumber);

  private entryFormService = inject(EntryFormService);
  public menuModalService = inject(MenuModalService);
  public optionModalService = inject(OptionModalService);
  public savePromptModalService = inject(SavePromptModalService);
  public interruptPromptModalService = inject(InterruptPromptModalService);

  constructor() {
    effect(() => {
      if(!this.menuModalService.isOpen()
        && !this.optionModalService.isOpen()
        && !this.savePromptModalService.isOpen()
        && !this.interruptPromptModalService.isOpen()) {
        this.entryFormService.focusCurrentControlFlow();
      }
    });
  }

  ngOnInit(): void {
    console.log(this.notificationCss());
  }
}
