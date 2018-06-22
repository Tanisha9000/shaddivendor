import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConectlistPage } from './conectlist';

@NgModule({
  declarations: [
    ConectlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ConectlistPage),
  ],
})
export class ConectlistPageModule {}
