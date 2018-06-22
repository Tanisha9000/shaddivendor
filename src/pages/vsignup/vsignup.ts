import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {VerifycodePage} from '../verifycode/verifycode';
@IonicPage()
@Component({
    selector: 'page-vsignup',
    templateUrl: 'vsignup.html',
})
export class VsignupPage {
    autocompleteItems: any;
    autocomplete: any;
    acService: any;
    placesService: any;
    [x: string]: any;
    searchQuery: string = '';
    id: any;
    name: any;
    number: any;
    vendor_type: any;
    vendortypeid: any;
    userid: any;
    data: {
        category: string,
        company: any,
        email: any,
        password: any,
        cpassword: any,
        phone: any,
        nameb: any,
        location: any,
    } = {
        category: '',
        company: '',
        email: '',
        password: '',
        cpassword: '',
        phone: '',
        nameb: '',
        location: ''
    };

    vendortype = [];
    m: any;
    longitude: number = 0;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private http: Http,
        public shaadi: ShaadiProvider,
        public toastCtrl: ToastController
    ) {
        this.gettype();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VsignupPage');
    }

    login() {
        this.navCtrl.push(LoginPage);
        }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    gettype() {
        let loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        loader.present();
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.get(this.shaadi.base_url + '/vendortypes', options)
            .map(res => res.json())
            .subscribe((data) => {
                loader.dismiss();
                console.log(data);
                for (let i in data.data) {
                    this.vendortype.push(data.data[i])
                }
            })
    }

    onInput(e) {
        console.log(e);
        console.log("input is triggered");
        if (this.data.password == "") {
            let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Enter password first',
                buttons: ['OK']
            });
            alert.present();
        } else {
            if (this.data.password == this.data.cpassword) {
                this.m = 1;
                setTimeout(() => {
                    this.m = 3;
                }, 2000)
            } else {
                this.m = 0;
            }
        }
    }

    onSubmit(formdata) {
        if (formdata.value.password != formdata.value.cpassword) {
            let alert = this.alertCtrl.create({
                title: 'Error ',
                subTitle: 'Passwords must match.',
                buttons: ['Try Again']
            });
            alert.present();
        } else {
            var split = formdata.value.category.split('-');
            this.id = split[1];
            this.name = split[0];
            var loading = this.loadingCtrl.create({
                spinner: 'bubbles',
                showBackdrop: false,
                cssClass: 'loader'
            });
            loading.present()
            var postdata = {
                vendor_type: this.name,
                company_name: formdata.value.company,
                phone: formdata.value.phone,
                password: formdata.value.password,
                find_us: formdata.value.nameb,
                role: "vendor",
                vendor_type_id: this.id
            }
           
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/home', serialized_all, options)
                .map(res => res.json())
                .subscribe((response) => {
                    loading.dismiss();
                    console.log(response);
                    if (response.status == true) {
                        localStorage.setItem("user_data", JSON.stringify(response.data))
                        if (response.error == 2) {
                            localStorage.setItem("response_message", JSON.stringify(response.message))
                        }
                        let loading = this.loadingCtrl.create({
                            spinner: 'bubbles',
                            showBackdrop: false,
                            cssClass: 'loader'
                        });
                        loading.present();
                        var postdata1 = {
                            phone: response.data.phone,
                            vendor_type: response.data.vendor_type,
                            vendor_type_id: response.data.vendor_type_id,
                            id: response.data._id,
                            role: "vendor"
                        }
                        console.log(postdata1);
                        var serialized_all = this.serializeObj(postdata1);
                        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
                        let options = new RequestOptions({headers: headers});
                        this.http.post(this.shaadi.base_url + '/users/getverification', serialized_all, options)
                            .map(res => res.json())
                            .subscribe((response) => {
                                loading.dismiss();
                                console.log(response);
                                if (response.status == true) {
                                    var toast = this.toastCtrl.create({
                                        message: response.message,
                                        duration: 3000,
                                        position: 'top'
                                    });
                                    toast.present();
                                    localStorage.setItem('verify_number',response.data.verified_number);
                                    this.navCtrl.push(VerifycodePage);
                                } else if (response.status == false) {
                                    var toast = this.toastCtrl.create({
                                        message: response.message,
                                        duration: 3000,
                                        position: 'top'
                                    });
                                    toast.present();
                                    if (response.error == 1) {
                                        var toast = this.toastCtrl.create({
                                            message: response.message,
                                            duration: 3000,
                                            position: 'top'
                                        });
                                        toast.present();
                                        localStorage.setItem('verify_number',response.data.verified_number);
                                        this.navCtrl.push(VerifycodePage);
                                    }
                                } else if (response.status == true && response.error == 2) {
                                    var toast = this.toastCtrl.create({
                                        message: response.message,
                                        duration: 3000,
                                        position: 'top'
                                    });
                                    toast.present();
                                    localStorage.setItem("response_message", JSON.stringify(response.message))
                                    localStorage.setItem('verify_number',response.data.verified_number);
                                    this.navCtrl.push(VerifycodePage);

                                }

                            })
                    } else if (response.status == false) {
                        var toast = this.toastCtrl.create({
                            message: response.message,
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                        if (response.error == 1) {
                            localStorage.setItem("user_data", JSON.stringify(response.data))
                            localStorage.setItem('verify_number',response.data.verified_number);
                            this.navCtrl.push(VerifycodePage);
                        }

                    }
                })

        }

    }


}
