import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {googlemaps} from 'googlemaps';
import {GoogleMaps, GoogleMapsEvent, GoogleMapOptions, MarkerOptions, Marker} from '@ionic-native/google-maps';
@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit
    {
    autocompleteItems: any;
    autocomplete = {
        query: ''
    };
    acService: any;
    placesService: any;
    map: any;
    placedetails: any = {           //stores lat long address of place
        address: '',
        lat: '',
        lng: '',
    };
    userdata: any = [];//stores locally store data
    arr: any = [];
    addons: any = [];//stores addons
    highs: any = [];//stores highlights
    additionaladdons: any = [];//stores additional addons
    additonalhighs: any = [];//stores additional highlights
    services: any = [];//stores services
    additionalservices: any = [];   //stores additional services
    discount: any = []; //stores discount
    detail: any;
    edate: any;
    disamt: any;
    location: any;
    vendor_type: any;
    price: any;
    company_name: any;
    email: any;
    phone: any;
    establishment_year: any;
    starthrs: any;
    endhrs: any;
    facebook_username: any;
    twitter_username: any;
    instagram_username: any;
    awards: any;
    respmessage: any;
    img: any = []; //stores gallery images
    profilepic = "assets/image/default_img.jpg"; //stores profile picture of vendor
    userfbresponse: any = []; //stores facebook response
    google_response: any = []; //stores google response
    
   doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
      this.getdetail();
      this.acService = new google.maps.places.AutocompleteService();
      this.autocompleteItems = [];
      this.autocomplete.query = this.userdata.location;
      this.initMap();
        if (localStorage.getItem("user_data")) {
            this.userdata = JSON.parse(localStorage.getItem("user_data"))
            //            alert(JSON.stringify(this.userdata));
            console.log(this.userdata)

        }
        if (localStorage.getItem('response_message')) {
            this.respmessage = localStorage.getItem('response_message');
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: this.respmessage,
                buttons: ['Dismiss']
            });
            alert.present();
        }
     
        this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
        console.log(this.userfbresponse)
        //            alert("Facebook response" + this.userfbresponse)
        if (this.userfbresponse) {
            this.email = this.userfbresponse.email;
            if (this.userfbresponse.picture) {
                //                    alert(this.userfbresponse.picture)
                // alert(JSON.parse(this.userfbresponse.picture))
                this.profilepic = this.userfbresponse.picture.data.url;
            }else{
                 this.profilepic = "assets/image/default_img.jpg";
            }
        }
        this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
        //            alert("Google response" + this.google_response)
        if (this.google_response) {
            if (this.google_response.imageUrl) {
                //                    alert(this.google_response.imageUrl)
                this.profilepic = this.google_response.imageUrl;
            }else{
                 this.profilepic = "assets/image/default_img.jpg";
            }
        }
    }, 2000);
  }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public shaadi: ShaadiProvider,
        private alertCtrl: AlertController,
        public googlemaps: GoogleMaps,
    ) {
        //            alert(localStorage.getItem("user_data"))
        if (localStorage.getItem("user_data")) {
            this.userdata = JSON.parse(localStorage.getItem("user_data"))
            //            alert(JSON.stringify(this.userdata));
            console.log(this.userdata)

        }
        if (localStorage.getItem('response_message')) {
            this.respmessage = localStorage.getItem('response_message');
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: this.respmessage,
                buttons: ['Dismiss']
            });
            alert.present();
        }
     
        this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
        console.log(this.userfbresponse)
        //            alert("Facebook response" + this.userfbresponse)
        if (this.userfbresponse) {
            this.email = this.userfbresponse.email;
            if (this.userfbresponse.picture) {
                //                    alert(this.userfbresponse.picture)
                // alert(JSON.parse(this.userfbresponse.picture))
                this.profilepic = this.userfbresponse.picture.data.url;
            }else{
                 this.profilepic = "assets/image/default_img.jpg";
            }
        }
        this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
        //            alert("Google response" + this.google_response)
        if (this.google_response) {
            if (this.google_response.imageUrl) {
                //                    alert(this.google_response.imageUrl)
                this.profilepic = this.google_response.imageUrl;
            }else{
                 this.profilepic = "assets/image/default_img.jpg";
            }
        }
        this.getdetail();
    
    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete.query = this.userdata.location;
        this.initMap();

    }

    private initMap() {
        var point = {lat: this.userdata.loc.coordinates[1], lng: this.userdata.loc.coordinates[0]};
        let divMap = (<HTMLInputElement> document.getElementById('map'));
        this.map = new google.maps.Map(divMap, {
            center: point,
            zoom: 15,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: true,
            fullscreenControl: true
        });

        let marker = new google.maps.Marker({
            position: {
                lat: this.userdata.loc.coordinates[1],
                lng: this.userdata.loc.coordinates[0]
            },
            map: this.map,

        });

    }


    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    getdetail() {
        var postdata = {
            _id: this.userdata._id,
        }
        console.log(postdata);
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/users/userdetails', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                if (response.status == true) {
                    console.log(response.data.addon)
                    if (response.data.addon.length > 0) {
                        this.addons = JSON.parse(response.data.addon)
                        console.log(this.addons)
                    }
                    if (response.data.highlights.length > 0) {
                        this.highs = JSON.parse(response.data.highlights)
                        console.log(this.highs)
                    }
                    if (response.data.additional_addon.length > 0) {
                        this.additionaladdons = JSON.parse(response.data.additional_addon)
                    }
                    if (response.data.additional_highlights.length > 0) {
                        this.additonalhighs = JSON.parse(response.data.additional_highlights)
                    }
                    if (response.data.services.length > 0) {
                        this.services = JSON.parse(response.data.services)
                        console.log(this.services)
                    }
                    if (response.data.additional_services.length > 0) {
                        this.additionalservices = JSON.parse(response.data.additional_services)
                    }
                    //            if(response.data.subvendortypes.length > 0){
                    //                this.subvendor = JSON.parse(response.data.subvendortypes);
                    //            }
                    if (response.data.discount) {
                        this.discount = JSON.parse(response.data.discount)
                    }
                    if (response.data.gallery) {
                        this.img = JSON.parse(response.data.gallery);
                    }

                    this.detail = response.data.product_detail;
                    this.edate = response.data.effective_date;
                    this.disamt = response.data.discount_amount;
                    this.vendor_type = response.data.vendor_type;
                    this.company_name = response.data.company_name;
                    this.price = response.data.minimum_price;
                    this.email = response.data.email;
                    this.phone = response.data.phone;
                    this.establishment_year = response.data.establishment_year;
                    this.starthrs = response.data.start_hours;
                    this.endhrs = response.data.end_hours;
                    this.facebook_username = response.data.facebook_username;
                    this.twitter_username = response.data.twitter_username;
                    this.instagram_username = response.data.instagram_username;
                    this.awards = response.data.awards;
                    
                    if(response.data.image != "null" || response.data.image != null || response.data.image !=""){
                      this.profilepic = response.data.image;  
                    }else{
                        this.profilepic = "assets/image/default_img.jpg";
                    }
                }
            })
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
    }

}
