import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobpostsummaryPage } from './jobpostsummary';

@NgModule({
  declarations: [
    JobpostsummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(JobpostsummaryPage),
  ],
})
export class JobpostsummaryPageModule {}
