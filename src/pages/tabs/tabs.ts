import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root="Tab1Page";
  tab2Root="Tab2Page";
  tab3Root="Tab3Page";
  myIndex="number";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      // Set the active tab based on the passed index from menu.ts
      this.myIndex = navParams.data.tabIndex || 0;
  }


}