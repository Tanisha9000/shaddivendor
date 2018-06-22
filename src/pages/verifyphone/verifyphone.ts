import {Component, OnInit, OnDestroy} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ChangepasswordPage} from '../changepassword/changepassword';

@IonicPage()
@Component({
    selector: 'page-verifyphone',
    templateUrl: 'verifyphone.html',
})
export class VerifyphonePage implements OnInit, OnDestroy {
    tick: number; //display counter value
    data = {
        code: ''
    };
    showresend: boolean = false; //bit to set resend button in html
    userdata: any = [];
    downloadTimer: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public shaadi: ShaadiProvider,
        public loadingCtrl: LoadingController,
        private http: Http,
        public toastCtrl: ToastController) {

        if (localStorage.getItem("user_data")) {
            this.userdata = JSON.parse(localStorage.getItem("user_data"))
            console.log(this.userdata);
        }
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    ngOnInit() {
        let timeleft = 30;
        this.downloadTimer = setInterval(() => {
            this.tick = --timeleft;
            console.log(this.tick);
            if (this.tick == 0) {
                this.showresend = true;
                clearInterval(this.downloadTimer);
            }
        }, 1000);
    }
    ngOnDestroy() {
        clearInterval(this.downloadTimer);
    }


    onSubmit(dataform) {
        console.log(dataform.value.code)
        var loading1 = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        loading1.present()
        var postdata1 = {
            id: this.userdata._id,
            code: dataform.value.code
        }
        console.log(postdata1);
        var serialized_all = this.serializeObj(postdata1);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/users/check_otp_pwd', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                loading1.dismiss();
                var toast = this.toastCtrl.create({
                    message: response.message,
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                if (response.status == true) {
                   // localStorage.setItem("user_data", JSON.stringify(response.data));   
                    this.navCtrl.push(ChangepasswordPage);
                }
            })
    }

    resend() {
        var postdata = { 
                phone : this.userdata.phone,
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

                })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VerifyphonePage');
    }

}
