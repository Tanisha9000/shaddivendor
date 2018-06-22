import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPage } from '../pages/login/login';
import { Intro } from '../pages/intro/intro';
import { MyApp } from './app.component';
import { SignupPage } from '../pages/signup/signup';
import { VsignupPage } from '../pages/vsignup/vsignup';
import { ForgotPage } from '../pages/forgot/forgot';
import { FilterPage } from '../pages/filter/filter';
import { FilterbPage } from '../pages/filterb/filterb';
import { ProcessPage } from '../pages/process/process';
import { ConnectionrankPage } from '../pages/connectionrank/connectionrank';
import { RewardPage } from '../pages/reward/reward';
import { ConectlistPage } from '../pages/conectlist/conectlist';
import { JobPage } from '../pages/job/job';
import { FiltercPage } from '../pages/filterc/filterc';
import { AddtodoPage } from '../pages/addtodo/addtodo';
import { ReviewPage } from '../pages/review/review';
import { ProfilePage } from '../pages/profile/profile';
import { JobdetailPage } from '../pages/jobdetail/jobdetail';
import { FbverifyPage } from '../pages/fbverify/fbverify';
import { ForgotoptionsPage } from '../pages/forgotoptions/forgotoptions'; 
import { ThroughphonePage } from '../pages/throughphone/throughphone'; 
import { VerifyphonePage } from '../pages/verifyphone/verifyphone';
import { VerifycodePage } from '../pages/verifycode/verifycode';
import { ShaadiProvider } from '../providers/shaadi/shaadi';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { MenuPage } from '../pages/menu/menu';
import { HttpModule, Headers, RequestOptions } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import {GoogleMaps} from '@ionic-native/google-maps';
import { Firebase } from '@ionic-native/firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Calendar } from '@ionic-native/calendar';

//import { NgCalendarModule  } from 'ionic2-calendar';
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    Intro,
    SignupPage,
    ForgotPage,
    FilterPage,
    FilterbPage,
    VsignupPage,
    ProcessPage,
    ConnectionrankPage,
    RewardPage,
    ConectlistPage,
    JobPage,
    FiltercPage,
    AddtodoPage,
    ReviewPage,
    ProfilePage,
    JobdetailPage,
    VerifycodePage,
    FbverifyPage,
    MenuPage,
    ForgotoptionsPage,
    ThroughphonePage,
    VerifyphonePage,
    ChangepasswordPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
   // NgCalendarModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    Intro,
    SignupPage,
    ForgotPage,
    FilterPage,
    FilterbPage,
    VsignupPage,
    ProcessPage,
    ConnectionrankPage,
    RewardPage,
    ConectlistPage,
    JobPage,
    FiltercPage,
    AddtodoPage,
    ReviewPage,
    ProfilePage,
    JobdetailPage,
    VerifycodePage,
    FbverifyPage,
    MenuPage,
    ForgotoptionsPage,
    ThroughphonePage,
    VerifyphonePage,
    ChangepasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    Geolocation,
    SocialSharing,
    Network,
    GoogleMaps,
    Firebase,
    Facebook,
    GooglePlus,
    Camera,
    NativeGeocoder,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ShaadiProvider,


  ]
})
export class AppModule {}
