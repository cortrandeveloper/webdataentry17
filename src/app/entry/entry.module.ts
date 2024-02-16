import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryRoutingModule } from './entry-routing.module';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { TestdeletemeComponent } from './pages/testdeleteme/testdeleteme.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextboxControlComponent } from './components/datentry-controls/textbox-control/textbox-control.component';
import { EntryLayoutComponent } from './layout/entry-layout/entry-layout.component';
import { OptionboxControlComponent } from './components/datentry-controls/optionbox-control/optionbox-control.component';
import { TreePipe } from './pipe/tree.pipe';
import { SelectGroupDirective } from './directives/select-group.directive';
import { CheckChildrenDirective } from './directives/check-children.directive';
import { CheckboxSampleComponent } from './components/datentry-controls/checkbox-sample/checkbox-sample.component';
import { EntryControlsDirective } from './directives/entry-controls.directive';
import { ListboxControlComponent } from './components/datentry-controls/listbox-control/listbox-control.component';
import { HttpClientModule } from '@angular/common/http';
import { AssignedJobsPageComponent } from './pages/assigned-jobs-page/assigned-jobs-page.component';
import { SavePromptModalComponent } from "./components/modals/prompts/save/save-prompt-modal.component";
import { InterruptPromptModalComponent } from './components/modals/prompts/interrupt/interrupt-prompt-modal.component';
import { ModalMenuContainerComponent } from './components/modals/menu/menu-container/menu-container.component';
import { ModalOptionComponent } from './components/modals/menu/option-container/option-container.component';


@NgModule({
  declarations: [
    EntryPageComponent,
    AssignedJobsPageComponent,
    TestdeletemeComponent,
    TextboxControlComponent,
    EntryLayoutComponent,
    OptionboxControlComponent,
    TreePipe,
    SelectGroupDirective,
    CheckChildrenDirective,
    EntryControlsDirective,
    CheckboxSampleComponent,
    ListboxControlComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    EntryRoutingModule,
    ModalMenuContainerComponent,
    ModalOptionComponent,
    SavePromptModalComponent,
    InterruptPromptModalComponent,
  ]
})
export class EntryModule { }
