import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConnectionrankPage} from "../connectionrank/connectionrank";
import {RewardPage} from '../reward/reward';
import {ConectlistPage} from "../conectlist/conectlist";
import {ModalController, AlertController, LoadingController, ToastController} from 'ionic-angular';
import {FilterPage} from '../filter/filter';
import {ReviewPage} from "../review/review";

import * as moment from 'moment';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http, Headers, RequestOptions} from '@angular/http';
@IonicPage()
@Component({
    selector: 'page-tab1',
    templateUrl: 'tab1.html',
})

export class Tab1Page{
    
    pets = 'profile';
    eventSource = [];
    viewTitle: string;
    selectedDay = new Date();
    objectkey = Object.keys;

    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    jobs : any=[];
   
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private http: Http,
        public shaadi: ShaadiProvider,
        public toastCtrl: ToastController) 
    {
        //   this.colorevents();
        this.getjobs();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad Tab1Page');
    }

    rankPage() {
        this.navCtrl.push(ConnectionrankPage);
    }

    rewardPage() {
        this.navCtrl.push(RewardPage);
    }

    conectPage() {
        this.navCtrl.push(ConectlistPage);
    }

    presentModal() {
        let modal = this.modalCtrl.create(FilterPage);
        modal.present();
    }

    reviewPage() {
        let modal = this.modalCtrl.create(ReviewPage);
        modal.present();
    }

    colorevents() {
        var events = [];
        events.push({
            title: 'Title for the event',
            //            startTime: startTime,
            //            endTime: endTime,
            eventColor: 'green'
        });

        //    return events;
    }

    addEvent() {
        let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
        modal.present();
        modal.onDidDismiss(data => {
            if (data) {
                let eventData = data;

                eventData.startTime = new Date(data.startTime);
                eventData.endTime = new Date(data.endTime);

                let events = this.eventSource;
                events.push(eventData);
                this.eventSource = [];
                setTimeout(() => {
                    this.eventSource = events;
                });
            }
        });
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
        console.log(this.viewTitle);
    }

    onEventSelected(event) {
        let start = moment(event.startTime).format('LLLL');
        let end = moment(event.endTime).format('LLLL');

        let alert = this.alertCtrl.create({
            title: '' + event.title,
            subTitle: 'From: ' + start + '<br>To: ' + end,
            buttons: ['OK']
        })
        alert.present();
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }
    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }
    getjobs() {
        let loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            showBackdrop: false,
            cssClass: 'loader'
        });
        loader.present();
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.get(this.shaadi.base_url + '/posts', options)
        .map(res => res.json())
        .subscribe((data) => {
                loader.dismiss();
                console.log(data);
                for (let i in data.data) {
                    this.jobs.push(data.data[i])
                  //  this.reqservices.push(data.data[i].required_service.myBudget)               
                }
             //   this.keys = this.reqservices;
             //   console.log(this.keys)
                console.log(this.jobs)
        })
    }

}
