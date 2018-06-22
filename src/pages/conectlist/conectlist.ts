import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JobPage } from "../job/job";

/**
 * Generated class for the ConectlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conectlist',
  templateUrl: 'conectlist.html',
})
export class ConectlistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConectlistPage');
  }

  jobPage(){
    this.navCtrl.push(JobPage);
  }

}
