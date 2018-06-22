import {Component, ViewChild} from '@angular/core';
import {Platform, AlertController, ToastController, ActionSheetController, Nav} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Intro} from '../pages/intro/intro';
import {Network} from '@ionic-native/network';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild("appNav") nav: Nav;
    rootPage: any = Intro;
    public alertShown: boolean = false;
    constructor(platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private network: Network,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public actionSheetCtrl: ActionSheetController,
    ) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //     platform.registerBackButtonAction(() => this.myHandlerFunction());
            platform.registerBackButtonAction(() => {
                if (this.alertShown == false) {
                    this.myHandlerFunction();
                }
            }, 0)
            statusBar.styleDefault();
            splashScreen.hide();

            let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
                console.log('network was disconnected :-(');
                let alert = this.alertCtrl.create({
                    title: 'Connection lost',
                    subTitle: 'There is no network connection',
                    buttons: ['OK']
                });
                alert.present();
            });
            let connectSubscription = this.network.onConnect().subscribe(() => {
                console.log('network connected!');
                setTimeout(() => {
                    if (this.network.type === 'wifi' || this.network.type === 'ethernet' || this.network.type === '2g' || this.network.type === '3g' || this.network.type === '4g' || this.network.type === 'cellular') {
                        console.log('we got a wifi connection, woohoo!');
                        var toast = this.toastCtrl.create({
                            message: "Connection found",
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                    }
                }, 3000);
                disconnectSubscription.unsubscribe();
            });

        });
    }
    myHandlerFunction() {
        //        let toast = this.toastCtrl.create({
        //      message: "Press Again to Confirm Exit",
        //      duration: 3000
        //    });
        //    toast.present();     
        let alert = this.alertCtrl.create({
            title: 'Do you want to exit?',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        navigator['app'].exitApp();
                        console.log('Ok clicked');
                        alert.dismiss().then(() => {
                            this.nav.pop();
                        });
                        return false;

                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel clicked');
                        this.alertShown = false;
                        alert.dismiss().then(() => {
                            this.nav.pop();
                        });
                        return false;
                    }
                },
            ]
        });
       alert.present().then(()=>{
         this.alertShown=true;
       });
    }

}

