import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';


@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private fb: Facebook,
      public googleplus: GooglePlus) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }
  
  logout(){
      this.fb.logout().then((res) => 
      console.log('Logged into Facebook!', res)).catch(e => 
      console.log('Error logging into Facebook', e));
      this.googleplus.logout().then((res) => 
      console.log('logged out of google',res)).catch(err => console.error(err));
      localStorage.clear();
      this.navCtrl.setRoot(LoginPage);
   }

}
