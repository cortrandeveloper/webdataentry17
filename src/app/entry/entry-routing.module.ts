import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { CommonModule } from '@angular/common';
import { EntryLayoutComponent } from './layout/entry-layout/entry-layout.component';
import { AssignedJobsPageComponent } from './pages/assigned-jobs-page/assigned-jobs-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'assigned-jobs', pathMatch: 'full' },
  { path: 'assigned-jobs', component: AssignedJobsPageComponent },
  {
    path: 'entry',
    component: EntryLayoutComponent,
    children:
      [
        { path: '', component: EntryPageComponent },
        { path: '**', redirectTo: 'entry' }
      ]
  },
  { path: '**', redirectTo: 'assigned-jobs' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
