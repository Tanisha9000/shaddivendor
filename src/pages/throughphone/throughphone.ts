import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions} from '@angular/http';
import {VerifyphonePage} from '../verifyphone/verifyphone';
/**
 * Generated class for the ThroughphonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-throughphone',
  templateUrl: 'throughphone.html',
})
export class ThroughphonePage {
data={
    phone:''
}
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public shaadi: ShaadiProvider,
        public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ForgotPage');
    }
    onSubmit(data) {           
        var postdata = { 
                phone : data.value.phone,
            }
            console.log(postdata);
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/get_otp_pwd', serialized_all, options)
                .map(res => res.json())
                .subscribe((response) => {
                    console.log(response);
                    var toast = this.toastCtrl.create({
                        message: response.message,
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                    if (response.status == true) {
                     localStorage.setItem("user_data", JSON.stringify(response.data))   
                     this.navCtrl.push(VerifyphonePage);
                    } 
                })
        
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }


}
