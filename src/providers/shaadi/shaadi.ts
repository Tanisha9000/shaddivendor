import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {ToastController} from 'ionic-angular';

@Injectable()
export class ShaadiProvider {
public base_url:string = 'http://hunny-env-1.sfftrpytm8.us-east-1.elasticbeanstalk.com/api';
//public toast = this.toastCtrl.create({
//    duration: 3000,
//    position: 'top',
//    
//});
  constructor(public http: Http, public toastCtrl : ToastController) {
    console.log('Hello ShaadiProvider Provider');
  }
      
}
