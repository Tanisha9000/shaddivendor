import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {VsignupPage} from "../vsignup/vsignup";
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Firebase} from '@ionic-native/firebase';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {ProcessPage} from "../process/process";
import {VerifycodePage} from '../verifycode/verifycode';
import {MenuPage} from '../menu/menu';
import {FbverifyPage} from '../fbverify/fbverify';
import {ForgotPage} from '../forgot/forgot';
import {ForgotoptionsPage} from '../forgotoptions/forgotoptions';
//import {TabsPage} from '../tabs/tabs';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    forgotoptions = ForgotoptionsPage;
    bit: boolean = false;
    userdata: any = [];
    userfbdata: any = [];
    data: any = {
        phone: '',
        pass: ''
    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private firebase: Firebase,
        public shaadi: ShaadiProvider,
        private http: Http,
        private fb: Facebook,
        public googleplus: GooglePlus,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController) 
        {
//            if(localStorage.getItem("user_data")){
//               this.navCtrl.push(ProcessPage);  
//            }
       
    }

    vsignup() {
        this.navCtrl.push(VsignupPage);
    }
//    forgot(){
//        this.navCtrl.push(ForgotoptionsPage);
//    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    login(frmdata) {
         this.firebase.getToken().then(token => {
             this.firebase.onTokenRefresh().subscribe((token: string) => {
                var postdata = {
                    password: frmdata.value.pass,
                    phone: frmdata.value.phone,
                    device_token: token,
                    role: "vendor"
                }
                console.log(postdata);
                var serialized_all = this.serializeObj(postdata);
                let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
                let options = new RequestOptions({headers: headers});
                this.http.post(this.shaadi.base_url + '/users/login1', serialized_all, options)
                    .map(res => res.json())
                    .subscribe((response) => {
                        console.log(response);
                        var toast = this.toastCtrl.create({
                            message: response.message,
                            duration: 3000,
                            position: 'bottom'
                        });
                        if (response.status == true) {
                            toast.present();
                            if (response.error == "2") {
                                localStorage.setItem("response_message", JSON.stringify(response.message))
                            }
                            localStorage.setItem("user_data", JSON.stringify(response.data))
                            this.navCtrl.setRoot(MenuPage);
                        } else {
                            if (response.error == "1") {
                                toast.present();
                                let alert = this.alertCtrl.create({
                                    title: 'Confirmation',
                                    message: 'Your phone number is not verified yet. Do you want to verify it first?',
                                    buttons: [
                                      {
                                        text: 'No',
                                        role: 'cancel',
                                        handler: () => {
                                          console.log('No clicked');
                                        }
                                      },
                                      {
                                        text: 'Yes',
                                        handler: () => {
                                          this.bit = true;
                                        }
                                      }
                                    ]
                                  });
                                  alert.present();
                            } else {
                                toast.present();
                            }
                            localStorage.setItem("user_data", JSON.stringify(response.data))
                        }
                    })
             });
         })
             .catch(error => 
             
             console.error('Error getting token', error));

    }
    verifyphone() {
        let loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        loader.present();
        this.userdata = JSON.parse(localStorage.getItem("user_data"))
        console.log(this.userdata)
        var postdata1 = {
            phone: this.userdata.phone,
            vendor_type: this.userdata.vendor_type,
            vendor_type_id: this.userdata.vendor_type_id,
            id: this.userdata._id,
            role: "vendor"
        }
        console.log(postdata1);
        var serialized_all = this.serializeObj(postdata1);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/users/getverification', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                loader.dismiss();
                console.log(response);
                if (response.status == true) {
                    this.navCtrl.push(VerifycodePage);
                }
            })
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
                            if (response.status == true) {    //when vendor has logged in again or is logging for first time bothe cases status is true
                                if (response.error == "1") {  //when account is inactive from admin
                                    localStorage.setItem("response_message", JSON.stringify(response.message))
                                }
                                toast.present();
                                localStorage.setItem("user_data", JSON.stringify(response.data))
//                                if (response.newuser == true) { //when vendor is not a new user, has already gone through the process
//                                    this.navCtrl.setRoot(MenuPage);
//                                } else {
                                    if (response.data.verified_number == "1") {  //incase when user's phone is verified but account is inactive so should not be directed to verification
                                        this.navCtrl.setRoot(MenuPage);
                                    } else {
                                        this.navCtrl.push(FbverifyPage);
                                    }
//                                }
                            } else {
                                toast.present();
                                localStorage.setItem("user_data", JSON.stringify(response.data))
                                this.navCtrl.push(FbverifyPage)
                            }
                        })
                }
            });
        }).catch(e =>       
        console.log('Error logging into Facebook', e));

    }

    logingoogle() {
        this.googleplus.login({}).then((res) => {
//            alert(JSON.stringify(res));
            console.log(res);
            localStorage.setItem('googleresponse', JSON.stringify(res))
            var postdata = {
                name: res.displayName,
                phone: res.userId,
                email: res.email,
                site: "google", // 'google' || 'fb'
                socialid: res.userId,
                role: "vendor", // user / vendor 
                vendor_type_id: res.userId,
            }
            console.log(postdata);
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/social_login', serialized_all, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    var toast = this.toastCtrl.create({
                        message: response.message,
                        duration: 3000,
                        position: 'top'
                    });
                    if (response.status == true) {    //when vendor has logged in again or is logging for first time bothe cases status is true
                        if (response.error == "1") {  //when account is inactive from admin
                            localStorage.setItem("response_message", JSON.stringify(response.message))
                        }
                        toast.present();
                        localStorage.setItem("user_data", JSON.stringify(response.data))
//                        if (response.newuser == true) { //when vendor is not a new user, has already gone through the process
//                            this.navCtrl.setRoot(MenuPage);
//                        } else {
                            if (response.data.verified_number == "1") {  //incase when user's phone is verified but account is inactive so should not be directed to verification
                                this.navCtrl.setRoot(MenuPage);
                            } else {
                                this.navCtrl.push(FbverifyPage);
                            }
                        
                    } else {
                        toast.present();
                        localStorage.setItem("user_data", JSON.stringify(response.data))
                        this.navCtrl.push(FbverifyPage)
                    }
                })
        }).catch((err1) => {
            alert("Not entered to login status" +" "+ err1)
        })
    }

}
