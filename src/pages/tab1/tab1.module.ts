import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab1Page } from './tab1';
import {NgCalendarModule} from 'ionic2-calendar';
@NgModule({
  declarations: [
    Tab1Page,
  ],
  imports: [
    IonicPageModule.forChild(Tab1Page),
    NgCalendarModule
  ],
})
export class Tab1PageModule {}
