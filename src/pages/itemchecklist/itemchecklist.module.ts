import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemchecklistPage } from './itemchecklist';

@NgModule({
  declarations: [
    ItemchecklistPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemchecklistPage),
  ],
})
export class ItemchecklistPageModule {}
