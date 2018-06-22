import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuestsummaryPage } from './guestsummary';

@NgModule({
  declarations: [
    GuestsummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(GuestsummaryPage),
  ],
})
export class GuestsummaryPageModule {}
