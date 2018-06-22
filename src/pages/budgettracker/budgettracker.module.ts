import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BudgettrackerPage } from './budgettracker';

@NgModule({
  declarations: [
    BudgettrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(BudgettrackerPage),
  ],
})
export class BudgettrackerPageModule {}
