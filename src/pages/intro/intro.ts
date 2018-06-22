import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { VsignupPage } from "../vsignup/vsignup";
import { ProcessPage } from "../process/process";
import {VerifycodePage} from '../verifycode/verifycode';
import {MenuPage} from '../menu/menu';
import {FbverifyPage} from '../fbverify/fbverify';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http,Headers, RequestOptions} from '@angular/http';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class Intro{
userfbdata :any=[];
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public toastCtrl: ToastController,
      public loadingCtrl : LoadingController,
      public shaadi:ShaadiProvider,
      private http: Http,
      private fb: Facebook) 
      {
      if(localStorage.getItem('user_data') != null){
          this.navCtrl.setRoot(MenuPage) 
//             this.navCtrl.push(ProcessPage);
      }
      }
     


ionViewDidLoad() {
    console.log('ionViewDidLoad Intro');
}

login(){
  this.navCtrl.push(LoginPage);
}
  
vsignup(){
  this.navCtrl.push(VsignupPage);
}

public serializeObj(obj) {
    var result = [];
    for (var property in obj)
    result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
}

    loginfacebook() {
        
        this.fb.login(['public_profile', 'user_friends', 'email']).then((res: FacebookLoginResponse) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            let options = new RequestOptions({headers: headers});
            this.http.post(' https://graph.facebook.com/v2.9/' + res.authResponse.userID + '?fields=id,picture,email,name,birthday,locale,age_range,gender,first_name,last_name&access_token=' + res.authResponse.accessToken, options).map(res => res.json()).subscribe(data => {
                this.userfbdata = data;
//                alert(JSON.stringify(data))
                console.log(data)
                console.log(this.userfbdata)
                localStorage.setItem('fbresponse', JSON.stringify(this.userfbdata))
                if (this.userfbdata.email == 'undefined') {
                    alert("Your FB account is not verified");
                } else {
                    let load = this.loadingCtrl.create({
                        spinner: 'bubbles',
                        showBackdrop: false,
                        cssClass: 'loader'
                    });
                    load.present();
                    var postdata = {
                        phone: this.userfbdata.id,
                        name: this.userfbdata.displayName,
                        site: "fb",
                        socialid: this.userfbdata.id,
                        vendor_type_id: this.userfbdata.id,
                        role: "vendor"
                    }
                    var serialized_all = this.serializeObj(postdata);
                    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
                    let options = new RequestOptions({headers: headers});
                    this.http.post(this.shaadi.base_url + '/users/social_login', serialized_all, options)
                        .map(res => res.json())
                        .subscribe((response) => {
                            load.dismiss();
                            console.log(response)
                            var toast = this.toastCtrl.create({
                                message: response.message,
                                duration: 3000,
                                position: 'top'
                            });
                            if (response.status == true) {
                                localStorage.setItem("user_data", JSON.stringify(response.data))    //when vendor has logged in again or is logging for first time bothe cases status is true
                                if (response.error == "1") {  //when account is inactive from admin
                                    localStorage.setItem("response_message", JSON.stringify(response.message))
                                }
                                toast.present();
                               
                                if (response.newuser == true) { //when vendor is not a new user, has already gone through the process
                                    this.navCtrl.setRoot(MenuPage);
                                } else {
                                    if (response.data.verified_number == "1") {  //incase when user's phone is verified but account is inactive so should not be directed to verification
                                        this.navCtrl.setRoot(MenuPage);
                                    } else {
                                        this.navCtrl.push(FbverifyPage);
                                    }
                                }
                            } else {
                                toast.present();
                                localStorage.setItem("user_data", JSON.stringify(response.data))
                                this.navCtrl.push(FbverifyPage)
                            }
                        })
                }
            });
        }).catch(e => console.log('Error logging into Facebook', e));

    }

}
