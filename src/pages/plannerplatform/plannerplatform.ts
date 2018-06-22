import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlannerplatformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plannerplatform',
  templateUrl: 'plannerplatform.html',
})
export class PlannerplatformPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlannerplatformPage');
  }


  itemChecklistPage() {
    this.navCtrl.push('ItemchecklistPage');
  } 

  todolistPage() {
      this.navCtrl.push('TodolistPage');
  }

  budgettrackerPage() {
    this.navCtrl.push('BudgettrackerPage');
  } 

  teamPage() {
    this.navCtrl.push('TeamperformancePage');
    }

  progressPage() {
    this.navCtrl.push('ProgressupdatePage');
  }

  timelinePage() {
    this.navCtrl.push('TimelinePage');
  }

  guestPage() {
    this.navCtrl.push('GuestsummaryPage');
  }

  jobpostsummaryPage() {
    this.navCtrl.push('JobpostsummaryPage');
  }
  
  vendorupdatePage() {
    this.navCtrl.push('VendorupdatePage');
  }
  
  basicinfoPage() {
    this.navCtrl.push('BasicinfoPage');
  }

  guestonePage() {
    this.navCtrl.push('GuestPage');
  }

  teammanagementPage() {
    this.navCtrl.push('TeammanagementPage');
  }

  commonitemPage() {
    this.navCtrl.push('CommonitemPage');
  }
  eventPage(){
      this.navCtrl.push('CreateeventPage');
  }

}
