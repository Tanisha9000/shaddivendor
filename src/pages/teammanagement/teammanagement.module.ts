import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeammanagementPage } from './teammanagement';

@NgModule({
  declarations: [
    TeammanagementPage,
  ],
  imports: [
    IonicPageModule.forChild(TeammanagementPage),
  ],
})
export class TeammanagementPageModule {}
