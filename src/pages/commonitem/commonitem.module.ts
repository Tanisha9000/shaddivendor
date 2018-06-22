import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonitemPage } from './commonitem';

@NgModule({
  declarations: [
    CommonitemPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonitemPage),
  ],
})
export class CommonitemPageModule {}
