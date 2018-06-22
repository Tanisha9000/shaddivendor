import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {Http,Headers, RequestOptions} from '@angular/http';
import { ShaadiProvider } from '../../providers/shaadi/shaadi';
import {VerifycodePage} from '../verifycode/verifycode';
import {MenuPage} from '../menu/menu';
@IonicPage()
@Component({
  selector: 'page-fbverify',
  templateUrl: 'fbverify.html',
})
export class FbverifyPage {
data ={
    phone :'',
    cname :'',
    category :''
}
vendortype :any=[];
id :any;
name : any;
userdata : any=[];
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public shaadi:ShaadiProvider,
      private http: Http,
      public loadingCtrl : LoadingController,
      public toastCtrl: ToastController) 
      {
          this.userdata = JSON.parse(localStorage.getItem("user_data"))
          this.gettype();
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FbverifyPage');
  }
  
public serializeObj(obj) {
    var result = [];
    for (var property in obj)
    result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
}

gettype(){
    let loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
    });
    loader.present();
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
    let options = new RequestOptions({ headers: headers });
    this.http.get(this.shaadi.base_url+'/vendortypes', options)
    .map(res=>res.json())
    .subscribe((data) => {
    loader.dismiss();    
     console.log(data);
    for (let i in data.data) {
    this.vendortype.push(data.data[i])
    }
    this.data.category=this.vendortype[0].title+"-"+this.vendortype[0]._id;
    })
}

onSubmit(formdata){
var split = formdata.value.category.split('-');
this.id = split[1];
this.name = split[0];  
  var postdata={
                phone: formdata.value.phone,
                id: this.userdata._id, 
                vendor_type_id: this.id, 
                vendor_type : this.name,
                company_name : formdata.value.cname, 
                role:'vendor' 
                     }
               console.log(postdata);
//               alert(postdata);
//               alert(JSON.stringify(postdata));
    var serialized_all = this.serializeObj(postdata);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.shaadi.base_url+'/users/addpending', serialized_all, options)
    .map(res=>res.json())
    .subscribe((response) => {
    console.log(response);
  //  alert(JSON.stringify(response))         
    if(response.status == true){
        var toast = this.toastCtrl.create({
        message: response.message,
        duration: 3000,
        position: 'top'
        });
        toast.present();
        localStorage.setItem("user_data",JSON.stringify(response.data))
        this.navCtrl.push(VerifycodePage);   
    }else if(response.status == false){
       var toast = this.toastCtrl.create({
        message: response.message,
        duration: 3000,
        position: 'top'
        });
        toast.present();
      //  this.navCtrl.setRoot(MenuPage); 
    }
    })  
}

}
