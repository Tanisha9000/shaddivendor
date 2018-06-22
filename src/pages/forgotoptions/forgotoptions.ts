import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ForgotPage} from '../forgot/forgot';
import {ThroughphonePage} from '../throughphone/throughphone';

/**
 * Generated class for the ForgotoptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotoptions',
  templateUrl: 'forgotoptions.html',
})
export class ForgotoptionsPage {
throughphone = ThroughphonePage;
throughemail = ForgotPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotoptionsPage');
  }



}
