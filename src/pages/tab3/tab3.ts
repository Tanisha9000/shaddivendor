import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';

@IonicPage()
@Component({
    selector: 'page-tab3',
    templateUrl: 'tab3.html',
})
export class Tab3Page {
    pet: any = 'current';
    show: any = [];
    postdata: any = '';
    userdata: any = [];
    constructor(
        public navCtrl: NavController,
        private http: Http,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public shaadi: ShaadiProvider,
        public navParams: NavParams) {
        if (localStorage.getItem("user_data")) {
            this.userdata = JSON.parse(localStorage.getItem("user_data"));
            console.log("its userdata", this.userdata);
        }
        this.getsdata();
//        if (localStorage.getItem("postdetails")) {
//            this.postdata = JSON.parse(localStorage.getItem("postdetails"));
//            console.log("its postdata", this.postdata);
//        }

    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad Tab3Page');
    }
    getsdata() {
        var loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        loading.present();
        var postdata = {
            _id: this.userdata._id
        }
        console.log(postdata);
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/allposts', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                loading.dismiss();
                if (response.status = true) {
                    localStorage.setItem('postdetails', JSON.stringify(response.data));
                    this.show = response.data;
                    console.log(this.show);
                } else {

                }
            }, err => {
                loading.dismiss();
                let alert = this.alertCtrl.create({
                    title: 'Internal Server Error !!',
                    subTitle: 'There is a problem with the resource you are looking for, and it cannot be displayed.',
                    buttons: ['OK']
                }); alert.present();
            })
    }
    /* Readmore button */
    readmore(id) {
        console.log(id);
        for (var data = 0; data < this.postdata.length; data++) {
            if (this.postdata[data]._id == id) {
                console.log(this.postdata[data]);
                localStorage.setItem('post', JSON.stringify(this.postdata[data]));
                this.navCtrl.push('JobdetailPage');
            }
        }
    }
    /* End */
    doRefresh(refresher) {
        setTimeout(() => {
            this.getsdata();
            refresher.complete();
        }, 2000);
    }
    postedit() {
        this.navCtrl.push('PosteditPage');
    }
    jobdetailPage() {
        this.navCtrl.push('JobdetailPage');
    }
    /* Serialize */
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    /* End */
}
