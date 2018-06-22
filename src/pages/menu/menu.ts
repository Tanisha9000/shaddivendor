import {Tab2Page} from './../tab2/tab2';
import {Tab1Page} from './../tab1/tab1';
import {TabsPage} from './../tabs/tabs';
import {SpecialPage} from "../special/special";
import {EditprofilePage} from "../editprofile/editprofile";
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, Nav, AlertController} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {ProcessPage} from '../process/process';
import {VsignupPage} from '../vsignup/vsignup';
import {VerifycodePage} from '../verifycode/verifycode';
import {LogoutPage} from '../logout/logout';
import {Facebook} from '@ionic-native/facebook';
//import {LoginPage} from '../login/login';
import {GooglePlus} from '@ionic-native/google-plus';
import {Intro} from '../intro/intro';
export interface PageInterface {
    title: string;
    pageName: string;
    tabComponent?: any;
    index?: number;
    icon: string;
}

@IonicPage()
@Component({
    selector: 'page-menu',
    templateUrl: 'menu.html',
})
export class MenuPage {
    // Basic root for our content view
    rootPage = 'TabsPage';
    // Reference to the app's root nav
    @ViewChild(Nav) nav: Nav;
    
    vendorimage = "assets/image/default_img.jpg";
    userdata: any = [];
    name: any;
    userfbresponse: any = []; //stores facebook response
    google_response: any = []; //stores google response
    verify_number :any;

    pages: PageInterface[] = [
        {title: 'Home', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 0, icon: 'home'},
        {title: 'Edit Profile', pageName: 'EditprofilePage', icon: 'contact'},
        {title: 'Change Password', pageName: 'ChangepasswordPage',icon:'lock'},
        {title: 'Logout', pageName: '', icon: 'log-out'},
        //    { title: 'Special', pageName: 'SpecialPage', icon: 'shuffle' },
    ];

    constructor(public navCtrl: NavController, private fb: Facebook, private alertCtrl: AlertController,public googleplus: GooglePlus) {
        //   this.navCtrl.push(VerifycodePage);
        //   this.navCtrl.push(ProcessPage);
        //      this.navCtrl.push(VsignupPage);
        if(localStorage.getItem("user_data")){
            this.userdata = JSON.parse(localStorage.getItem("user_data"));
            console.log(this.userdata)
            this.name = this.userdata.company_name;
//            this.verify_number = localStorage.getItem('verify_number');
//            console.log(this.verify_number);
//            if (this.verify_number == "0"){
//              this.navCtrl.setRoot(VerifycodePage);  
//            }
//            if (this.userdata.verified_number == "0"){
//               this.navCtrl.push(Intro);  
//            }
            if (this.userdata.image != null || this.userdata.image != "null" || this.userdata.image != "" ){
                this.vendorimage = this.userdata.image;
            }else{
                this.vendorimage = "assets/image/default_img.jpg";
            }    
                
        }
        
        if(localStorage.getItem('fbresponse')){
             this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
             console.log(this.userfbresponse);
             if (this.userfbresponse.picture) {
               this.vendorimage = this.userfbresponse.picture.data.url;
            }else{
                 this.vendorimage = "assets/image/default_img.jpg";
            }
        }

        if (localStorage.getItem('googleresponse')) {
            this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
            if (this.google_response.imageUrl) {
                //alert(this.google_response.imageUrl)
                this.vendorimage = this.google_response.imageUrl;
            }else{
               this.vendorimage = "assets/image/default_img.jpg"; 
            }
        }

    }

    openPage(page: PageInterface) {
        let params = {};
        // The index is equal to the order of our tabs inside tabs.ts
        if (page.index) {
            params = {tabIndex: page.index};
        }

        // The active child nav is our Tabs Navigation
        if (this.nav.getActiveChildNav() && page.index != undefined) {
            this.nav.getActiveChildNav().select(page.index);
        } else {
            // Tabs are not active, so reset the root page 
            // In this case: moving to or from SpecialPage
            this.nav.setRoot(page.pageName, params);
        }
        
        if (page.title == 'Logout') {
            let alert = this.alertCtrl.create({
                title: 'Confirm',
                message: 'Do you want to logout?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            console.log('Ok clicked');
                            this.fb.logout().then((res) =>
                                console.log('Logged into Facebook!', res)).catch(e =>
                                    console.log('Error logging into Facebook', e));
                            this.googleplus.logout().then((res) => 
                                  console.log('logged out of google',res)).catch(err => 
                                  console.error(err));        
                            localStorage.clear();
                            this.navCtrl.setRoot(Intro);
                        }
                    }
                ]
            });
            alert.present();

        }


    }

    isActive(page: PageInterface) {
        // Again the Tabs Navigation
        let childNav = this.nav.getActiveChildNav();

        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
                return 'primary';
            }
            return;
        }

        // Fallback needed when there is no active childnav (tabs not active)
        if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
            return 'primary';
        }
        return;
    }



    profilePage() {
        this.navCtrl.push(ProfilePage);
    }

}