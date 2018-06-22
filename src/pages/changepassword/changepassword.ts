import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import 'rxjs/add/operator/map';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoginPage} from '../login/login';

@IonicPage()
@Component({
    selector: 'page-changepassword',
    templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
    data: any = {
        password: "",
        cpassword: ""
    };
    userdata: any = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public shaadi: ShaadiProvider,
        public toastCtrl: ToastController) 
    {
        this.userdata = JSON.parse(localStorage.getItem("user_data"))
        console.log(this.userdata);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangepasswordPage');
    }
    /* Function */
    onSubmit(data) {
        var loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        if (data.value.newpassword != data.value.cpassword) {
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Passwords must match',
                buttons: ['Try Again']
            }); alert.present();
        } else {
            console.log(data);
            loading.present()
            var postdata = {
                id: this.userdata._id,
                password: data.value.newpassword,
            }
            console.log(postdata);
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/resetpassword', serialized_all, options)
                .map(res => res.json())
                .subscribe((response) => {
                    loading.dismiss();
                    console.log(response);       
                    var toast = this.toastCtrl.create({
                            message: response.message,
                            duration: 3000,
                            position: 'bottom'
                    });
                    toast.present();
                    if (response.status == true) {
                        localStorage.clear();
                        this.navCtrl.push(LoginPage);
                    } else {
                        console.log('not reset password')
                    }
                })
        }
    }
    /* End */
    /* Serialize */
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    /* End */
}