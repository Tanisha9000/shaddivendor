import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { FiltercPage } from '../filterc/filterc';
import { AddtodoPage } from '../addtodo/addtodo';
/**
 * Generated class for the Tab2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html',
})
export class Tab2Page {
 pet ='Profile';
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  }

  plannerplatform(){
    //
    this.navCtrl.push('PlannerplatformPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tab2Page');
  }


   presentModal() {
    let modal = this.modalCtrl.create(FiltercPage);
    modal.present();
  }

   dismiss() {
   let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }

addtodoPage(){
    this.navCtrl.push(AddtodoPage);
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
    this.navCtrl.push('TeamperformacePage');
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
