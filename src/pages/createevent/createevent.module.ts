import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateeventPage } from './createevent';

@NgModule({
  declarations: [
    CreateeventPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateeventPage),
  ],
})
export class CreateeventPageModule {}
