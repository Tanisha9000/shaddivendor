import {Component, OnInit, OnDestroy} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ProcessPage} from '../process/process';
import 'rxjs/Rx';

@IonicPage()
@Component({
    selector: 'page-verifycode',
    templateUrl: 'verifycode.html',
})
export class VerifycodePage implements OnInit,OnDestroy{
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
        
        if(localStorage.getItem("user_data")){
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
            phone: this.userdata.phone,
            code:dataform.value.code
        }
        console.log(postdata1);
        var serialized_all = this.serializeObj(postdata1);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/users/checkcode', serialized_all, options)
        .map(res => res.json())
        .subscribe((response) => {
        console.log(response);
        loading1.dismiss();
        if (response.status == true) {
           localStorage.setItem("user_data",JSON.stringify(response.data))
           localStorage.setItem('verify_number',response.data.verified_number); 
            var toast = this.toastCtrl.create({
                message: response.data.message,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        this.navCtrl.push(ProcessPage);
        }else if(response.status == false){
            var toast = this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    })
    }

    resend() {
        this.ngOnInit();
        this.showresend = false;
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
        console.log(response);
              

            })
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad VerifycodePage');
    }

}
