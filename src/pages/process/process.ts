import {Component, NgZone, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {AlertController, ToastController, Events, ActionSheetController, LoadingController} from 'ionic-angular';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Http, Headers, RequestOptions} from '@angular/http';
import {SocialSharing} from '@ionic-native/social-sharing';
//import {GoogleMapsProvider} from '../../providers/google-maps/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {googlemaps} from 'googlemaps';
import {GoogleMaps, GoogleMapsEvent, GoogleMapOptions, MarkerOptions, Marker} from '@ionic-native/google-maps';
import {Camera} from '@ionic-native/camera';
import {NativeGeocoder, NativeGeocoderReverseResult} from '@ionic-native/native-geocoder';
import {MenuPage} from '../menu/menu';
@IonicPage()
@Component({
    selector: 'page-process',
    templateUrl: 'process.html',
})
export class ProcessPage implements OnInit {
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

    x: number = 0; // bit to show more button of add-ons
    y; number = 0; //bit to show more button of highlights   
    data = {
        title: '',  //this stores more addons fields
        amount: ''
    }
    data1 = {
        title1: '',
        amtt: ''
    }
    dat = {
        name: '',    //stores new parameters of service
        amount: '',

    }
    chk = [];
    chk1 = {
        check3: false,
        check2: false  //holds more checkbox Add-on value
    }
    disc = {
        dis: '',
        titlee: '',   //holds discount values
        amountt: '',
        dayy: ''
    }
    extra = {
        cname: '',      //holds value of all other input fields
        year: '',
        starthour: '',
        endhour: '',
        facebuk: '',
        insta: '',
        twiter: '',
        mail: '',
        award: '',
        price: '',
        pdetail: '',
        edate: '',
        damount: '',
        aboutus: ''
    }
    image_data = "";
    vendorimage = "assets/image/default_img.jpg"; //displays profile picture
    img: any = []; //holds image url from response gallery
    imglink: any = '' //holds image url from profile picture
    subvendor1: any = []; //holds selected subvendor values
    highlight: any = []; //stores highlights of response
    highlight1: any = []; //stores all additional highlights
    discount: any = []; //array to hold discount values
    subvendor: any = [];//holds all subvendor values
    serv: any = []; //holds services
    addval: any = []; //new array that store title and price of addons
    addval1: any = []; //new array that stores updated additional addons
    bit: number = 0; //bit to show addmore fields
    high: any = []; //holds selected highlights
    highval: any = []; //holds updated additional highlights
    addonvalues: any = []; //stores all add-ons 
    moreaddons: any = []; //stores additional add-ons
    userdata: any = []; //set and get local storage data
    //testCheckboxOpen: boolean;
    //testCheckboxResult;
    title: any;//displays vendor type chosen
    ttitle: any; //displays company name dynamically
    service: any = [];  //holds response services
    service1: any = []; //holds new services added
    respmessage: any; //displays message when account is inactive
    lat: any;//stores latitude
    long: any; //stores longitude
    userfbresponse: any = []; //stores fb response  
    google_response: any = [];

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            this.userdata = JSON.parse(localStorage.getItem("user_data"))
            console.log(this.userdata);

            if (this.userdata) {
                this.extra.cname = this.userdata.company_name;
            }
            this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
            console.log(this.userfbresponse)
            //      alert("Facebook response" + JSON.stringify(this.userfbresponse))
            //      alert("bfczd");
            if (this.userfbresponse) {
                if (this.userfbresponse.picture) {
                    //        alert(this.userfbresponse.picture)
                    //        alert("picture");

                    this.vendorimage = this.userfbresponse.picture.data.url;
                    this.imglink = this.userfbresponse.picture.data.url;
                } else {
                       this.vendorimage = "assets/image/default_img.jpg";
                    this.imglink = "../assets/image/default_img.jpg";
                }
                this.extra.mail = this.userfbresponse.email;
            }
            this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
            //      alert("Google response" + this.google_response)
            if (this.google_response) {
                if (this.google_response.imageUrl) {
                    //              alert(this.google_response.imageUrl)
                    this.vendorimage = this.google_response.imageUrl;
                    this.imglink = this.google_response.imageUrl;
                } else {
                    this.vendorimage = "assets/image/default_img.jpg";
                    this.imglink = "../assets/image/default_img.jpg";
                }
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

            this.getsinglevendor();
            this.getsubvendors();
            this.acService = new google.maps.places.AutocompleteService();
            this.autocompleteItems = [];
            this.autocomplete = {
                query: ''
            };
            this.initMap();

            refresher.complete();

        }, 2000);
    }
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public shaadi: ShaadiProvider,
        private http: Http,
        private socialSharing: SocialSharing,
        public toastCtrl: ToastController,
        public zone: NgZone,
        public googlemaps: GoogleMaps,
        public platform: Platform,
        public geolocation: Geolocation,
        public viewCtrl: ViewController,
        public events: Events,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        public loadingCtrl: LoadingController,
        private nativeGeocoder: NativeGeocoder) {

        this.userdata = JSON.parse(localStorage.getItem("user_data"))
        console.log(this.userdata);

        if (this.userdata) {
            this.extra.cname = this.userdata.company_name;
        }
        this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
        console.log(this.userfbresponse)
        //      alert("Facebook response" + JSON.stringify(this.userfbresponse))
        //      alert("bfczd");
        if (this.userfbresponse) {
            if (this.userfbresponse.picture) {
                //        alert(this.userfbresponse.picture)
                //        alert("picture");

                this.vendorimage = this.userfbresponse.picture.data.url;
                this.imglink = this.userfbresponse.picture.data.url;
            } else {
                this.vendorimage = "assets/image/default_img.jpg";
                this.imglink = "../assets/image/default_img.jpg";
            }
            this.extra.mail = this.userfbresponse.email;
        }
        this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
        //      alert("Google response" + this.google_response)
        if (this.google_response) {
            if (this.google_response.imageUrl) {
                //              alert(this.google_response.imageUrl)
                this.vendorimage = this.google_response.imageUrl;
                this.imglink = this.google_response.imageUrl;
            } else {
                this.vendorimage = "assets/image/default_img.jpg";
                this.imglink = "../assets/image/default_img.jpg";
            }
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

        this.getsinglevendor();
        this.getsubvendors();

    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
        this.initMap();
    }

    private initMap() {
        let divMap = (<HTMLInputElement> document.getElementById('map'));
        this.geolocation.getCurrentPosition().then(res => {
//            alert(JSON.stringify(res));
//            alert('tanisha');
            var latitude = res.coords.latitude
            var longitude = res.coords.longitude
            var point = {lat: latitude, lng: longitude};
 //           alert(JSON.stringify(point))
            this.map = new google.maps.Map(divMap, {
                center: point,
                zoom: 15,
                disableDefaultUI: true,
                draggable: true,
                zoomControl: true,
                fullscreenControl: true
            });

            let marker = new google.maps.Marker({
                position: {
                    lat: latitude,
                    lng: longitude
                },
                map: this.map,
                draggable: true
            });
 //           alert('marker')
            marker.addListener('dragend', () => {
                var pos = marker.getPosition();
                console.log(pos)
                //    alert(JSON.stringify(pos)) 
                this.placedetails.lat = pos.lat();
                this.placedetails.lng = pos.lng();
                this.nativeGeocoder.reverseGeocode(this.placedetails.lat, this.placedetails.lng).then((result: NativeGeocoderReverseResult) => {
                    //                    alert(JSON.stringify(result))
                    if (result.countryName) {
                        this.autocomplete.query = result.thoroughfare + "," + result.subLocality + "," + result.countryName;
                        //                        alert("chewkc");
                        //                        alert(this.autocomplete.query);
                    }
                }).catch((error: any) => alert(error));

            });
        }).catch((error) => {
            console.log('Error getting location', error);
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: error,
                buttons: ['Dismiss']
            });
            alert.present();
        });

    }

    updateSearch() {
        console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = {
            input: this.autocomplete.query,
            componentRestrictions: {}
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                self.autocompleteItems.push(prediction);
            });
        });
    }

    selectPlace(place) {
        console.log(place);
        this.autocomplete.query = place.description;
        this.autocompleteItems = [];
        // var self = this;
        var request = {
            placeId: place.place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, (place, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('page > getPlaceDetail > place > ', place);
                // set full address
                this.placedetails.address = place.formatted_address;
                this.placedetails.lat = place.geometry.location.lat();
                this.placedetails.lng = place.geometry.location.lng();
                //                for (var i = 0; i < place.address_components.length; i++) {
                //                    let addressType = place.address_components[i].types[0];
                //                    let values = {
                //                        name: place.structured_formatting.main_text
                //                    }
                //                    if(self.placedetails.components[addressType]) {
                //                        self.placedetails.components[addressType].set = true;
                //                        self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                //                        self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                //                    }                                     
                //                }                  
                // set place in map
                this.map.setCenter(place.geometry.location);
                this.createMapMarker(place);
                // populate
                //                self.address.set = true;
                console.log('page > getPlaceDetail > details > ', this.placedetails);
            } else {
                console.log('page > getPlaceDetail > status > ', status);
            }
        });
        //        function callback(place, status) {
        //            
        //        }

    }
    private createMapMarker(place: any): void {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc
        });

    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    getsinglevendor() {
        var postdata = {
            id: this.userdata.vendor_type_id,
        }
        console.log(postdata);
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/vendortypes/typebyid', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                if (response.data.more_addons == true) {
                    this.x = 1;
                }
                if (response.data.more_highlights == true) {
                    this.y = 1;
                }
                if (response.data.addons != "") {
                    var str = response.data.addons;
                    var str1 = str.search(",");
                    if (str1 != -1) {
                        var split = str.split(',');
                        for (let j in split) {
                            this.addonvalues.push({'title': split[j], 'price': ''});
                        }
                    }
                }
                this.title = response.data.title;
                this.service = response.data.services;
                if (response.data.highlights != "") {
                    var high = response.data.highlights;
                    var high1 = high.search(",");
                    if (high1 != -1) {
                        var split = high.split(',');
                        for (let i in split) {
                            this.highlight.push({'title': split[i], 'price': ''});
                        }
                    }
                }

            })
    }

    getsubvendors() {
        var postdata1 = {
            id: this.userdata.vendor_type_id,
        }
        console.log(postdata1);
        var serialized_all = this.serializeObj(postdata1);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/vendor_subtypes_byvendor', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                for (let res in response.data) {
                    this.subvendor.push({'subvendortype_id': response.data[res]._id, 'title': response.data[res].title});
                }
                console.log(this.subvendor);
            })
    }

    adddisc() {
        if (this.disc.titlee != '' || this.disc.amountt != '' || this.disc.dayy != '') {
            this.discount.push({'title': this.disc.titlee, 'price': this.disc.amountt, 'day': this.disc.dayy});
            console.log(this.discount)
            //        alert(JSON.stringify(this.discount))
            this.disc.titlee = '';
            this.disc.amountt = '';
            this.disc.dayy = '';

        } else {
            var toast = this.toastCtrl.create({
                message: "Please fill the discount details",
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    }

    addhigh() {
        if (this.data1.title1 == "" || this.data1.amtt == "") {
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please enter the data first',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            console.log("more highlights to be added");
            this.highlight1.push({'title': this.data1.title1, 'price': this.data1.amtt});
            this.data1.title1 = '';
            this.data1.amtt = '';
            this.chk1.check3 = false;
        }
    }

    displayamt1(ch, i, pr) {
        console.log("checkbox is" + ch);
        console.log("price is" + pr);
        console.log("index is" + i);
        if (ch == false) {
            this.highlight[i].price = '';
        }
    }

    displayamt(pr, ch, i) {
        console.log("checked :" + ch);
        console.log("index is " + i);
        console.log(this.addonvalues[i]);
        console.log(this.addonvalues);
        console.log(this.addonvalues[i].price);
        //    console.log("price is" +pr);
        if (ch == false) {
            this.addonvalues[i].price = '';
        }
    }

    add() {
        if (this.data.title == "" || this.data.amount == "") {
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please enter the data first',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            console.log(this.addonvalues)
            console.log(this.moreaddons);
            this.moreaddons.push({'title': this.data.title, 'price': this.data.amount});
            console.log(this.moreaddons);
            this.data.title = '';
            this.data.amount = '';
            this.chk1.check2 = false;
        }
    }

    addservice() {
        console.log("adding more services");
        this.bit = 1;
    }

    addmore() {
        if (this.dat.name == "" || this.dat.amount == "") {
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please enter the data first',
                buttons: ['Ok']
            });
            alert.present();
        } else {
            this.service1.push({'name': this.dat.name, 'pricing': this.dat.amount});
            console.log(this.service1)
            this.dat.name = '';
            this.dat.amount = '';
            this.bit = 0;
        }

    }

    presentActionSheet(bit) {
        const actionsheet = this.actionSheetCtrl.create({
            title: "Profile Photo",
            cssClass: 'title',
            buttons: [
                {
                    text: 'Camera',
                    icon: 'camera',
                    handler: () => {
                        this.getPicture(1, bit); // 0 == Camera
                    }
                }, {
                    text: 'Gallery',
                    icon: 'images',
                    handler: () => {
                        this.getPicture(0, bit); // 0 == Library
                    }
                },
                {
                    text: 'Remove',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.remove_photo();
                        console.log('Delete clicked');
                    }
                },
                {
                    //                text: 'Cancel',
                    icon: 'close',
                    cssClass: 'close',
                    role: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                        //  actionsheet.dismiss();
                    }
                },
            ]
        });
        actionsheet.present();
    }

    remove_photo() {
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to remove this photo?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                        this.imglink = "../assets/image/default_img.jpg";
                        this.vendorimage = "assets/image/default_img.jpg";
                    }
                }
            ]
        });
        alert.present();

    }


    //
    //presentActionSheet(bit) {
    //    const actionSheet = this.actionSheetCtrl.create({
    //    buttons: [
    //    {
    //    text: 'Choose Photo',
    //    handler: () => {
    //    this.getPicture(0, bit); // 0 == Library
    //    }
    //    }, {
    //    text: 'Take Photo',
    //    handler: () => {
    //    this.getPicture(1,bit); // 1 == Camera
    //    }
    //    }
    //    ]
    //    });
    //    actionSheet.present();
    //}

    getPicture(sourceType: number, bitt) {
        // You can check the values here:
        // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
        this.camera.getPicture({
            quality: 10,
            destinationType: 0, // DATA_URL
            sourceType,
            allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then((imageData) => {
            if (bitt == 4) {
                this.image_data = imageData;
                this.vendorimage = 'data:image/jpeg;base64,' + imageData;
                this.postpic(imageData, bitt);
            } else if (bitt == 5) {
                this.image_data = imageData;
                //        this.vendorimg='data:image/jpeg;base64,' + imageData;
                this.postpic(imageData, bitt);
            }
        }, (err) => {
            var toast = this.toastCtrl.create({
                message: JSON.stringify(err),
                duration: 3000,
                position: 'top'
            });
            toast.present();
        });
    }

    postpic(imageData, b) {
        //    alert(JSON.stringify(imageData))
        if (b == 4) {
            let load = this.loadingCtrl.create({
                content: 'uploading image...',
                spinner: 'bubbles',
                showBackdrop: false,
                cssClass: 'loader'
            });
            load.present()
            var postdata = {
                profile_picture: imageData,
                user_id: this.userdata._id,
            }
            var serialized_all = this.serializeObj(postdata);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/post_user_image_app ', serialized_all, options)
                .map(res => res.json())
                .subscribe((data) => {
                    load.dismiss();
                    if (data.status == true) {
                        this.imglink = data.data.image;
                        //           alert(JSON.stringify(this.imglink))
                        var toast = this.toastCtrl.create({
                            message: JSON.stringify(data.message),
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                    }
                })
        } else if (b == 5) {
            let load = this.loadingCtrl.create({
                content: 'uploading image...',
                spinner: 'bubbles',
                showBackdrop: false,
                cssClass: 'loader'
            });
            load.present()
            var postdata1 = {
                image: imageData
            }
            var serialized_all = this.serializeObj(postdata1);
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
            let options = new RequestOptions({headers: headers});
            this.http.post(this.shaadi.base_url + '/users/gallary_image', serialized_all, options)
                .map(res => res.json())
                .subscribe((data) => {
                    load.dismiss();
                    if (data.status == true) {
                        this.img.push({'image': data.image});
                        //            alert(this.img)
                        //            alert(JSON.stringify(this.img))
                        console.log(this.img)
                        var toast = this.toastCtrl.create({
                            message: JSON.stringify(data.message),
                            duration: 3000,
                            position: 'top'
                        });
                        toast.present();
                    }
                })
        }
    }

    crossimage(index, linkk) {
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Do you want to delete this photo?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        console.log('confirm clicked');
                        console.log("link of image" + linkk);
                        console.log("index of image" + index);
                        this.img.splice(index, 1);
                        console.log(this.img)
                    }
                }
            ]
        });
        alert.present();
    }

    publish(frmdata) {
        if (this.addonvalues.length > 0) {
            for (let addy in this.addonvalues) {
                if (this.addonvalues[addy].check == true) {

                    this.addval.push({'title': this.addonvalues[addy].title, 'price': this.addonvalues[addy].price});
                }
            }
            //      console.log("add-ons" + JSON.stringify(this.addval));  
        }
        if (this.moreaddons.length > 0) {
            for (let a in this.moreaddons) {
                if (this.moreaddons[a].check1 == true) {
                    this.addval1.push({'title': this.moreaddons[a].title, 'price': this.moreaddons[a].price});
                }
            }
            console.log("additional add-ons" + JSON.stringify(this.addval1));
        }
        if (this.service.length > 0) {
            for (let frm in this.service) {
                if (this.service[frm].pri != "" && this.service[frm].pri != undefined) {
                    console.log(this.service[frm].name)
                    this.serv.push({'name': this.service[frm].name, 'pricing': this.service[frm].pri});
                }
                //     console.log("services"+ JSON.stringify(this.serv));
            }
        }

        if (this.highlight.length > 0) {
            for (let hi in this.highlight) {
                if (this.highlight[hi].chec == true) {
                    this.high.push({'title': this.highlight[hi].title, 'price': this.highlight[hi].price});
                }
            }
            console.log(this.high);
        }

        if (this.highlight1.length > 0) {
            for (let hi1 in this.highlight1) {
                if (this.highlight1[hi1].checkk == true) {
                    this.highval.push({'title': this.highlight1[hi1].title, 'price': this.highlight1[hi1].price});
                }
            }
            console.log("additional highlights" + JSON.stringify(this.highval));
        }
        if (this.subvendor.length > 0) {
            for (let sub in this.subvendor) {
                if (this.subvendor[sub].checkkk == true) {
                    this.subvendor1.push({'subvendortype_id': this.subvendor[sub].subvendortype_id, 'title': this.subvendor[sub].title});
                }
            }
            console.log(this.subvendor1);
        }
        if (!this.imglink) {
            console.log('no image set')
            this.imglink = "../assets/image/default_img.jpg";
        }

        var postdata2 = {
            id: this.userdata._id,
            establishment_year: frmdata.value.year,
            start_hours: frmdata.value.starthour,
            end_hours: frmdata.value.endhour,
            facebook_username: frmdata.value.facebuk,
            twitter_username: frmdata.value.twiter,
            instagram_username: frmdata.value.insta,
            location: this.autocomplete.query,
            email: frmdata.value.mail,
            discount: JSON.stringify(this.discount, null, ''),
            discount_amount: frmdata.value.damount,
            effective_date: frmdata.value.edate,
            product_detail: frmdata.value.pdetail,
            awards: frmdata.value.award,
            vendor_type: this.userdata.vendor_type,
            vendor_type_id: this.userdata.vendor_type_id,
            phone: this.userdata.phone,
            company_name: frmdata.value.cname,
            about_us: frmdata.value.aboutus,
            minimum_price: frmdata.value.price,
            additional_addon: JSON.stringify(this.addval1, null, ''),
            addon: JSON.stringify(this.addval, null, ''),
            highlights: JSON.stringify(this.high, null, ''),
            additional_highlights: JSON.stringify(this.highval, null, ''),
            additional_services: JSON.stringify(this.service1, null, ''),
            services: JSON.stringify(this.serv, null, ''),
            subvendortypes: JSON.stringify(this.subvendor1, null, ''),
            status: this.userdata.status,
            image: this.imglink,
            gallery: JSON.stringify(this.img, null, ''),
            latitude: this.placedetails.lat,
            longitude: this.placedetails.lng
        }
        console.log(postdata2);

        var serialized_all = this.serializeObj(postdata2);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/users/savebasicinfo_new', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                var toast = this.toastCtrl.create({
                    message: response.message,
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                if (response.status == true) {
                    localStorage.setItem("user_data", JSON.stringify(response.data))
                    localStorage.setItem('verify_number', response.data.verified_number);
                    this.navCtrl.setRoot(MenuPage);
                }

            })
    }

    fbsss() {
        var link = "http://wedding-env-1.wtwqivxz56.us-east-1.elasticbeanstalk.com/invitationcode?code=" + this.userdata._id;
        this.socialSharing.shareViaFacebook('Hi there! I am inviting you to join the DOST network, an app for all things wedding! Sign up as a vendor and have access to all the business opportunities around you and connect with your users directly. Use the code "' + this.userdata.invitecode + '" while signing up so you and I can enjoy early bird offers. Cheers!. Enjoy! App Link ' + link, null /*Image*/, link)
            .then(() => {
                var toast = this.toastCtrl.create({
                    message: "Shared successfully",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            },
            () => {
                var toast = this.toastCtrl.create({
                    message: "Something is wrong! couldnt share to facebook",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            })
    }
    emails() {
        var link = "https://play.google.com/store/apps/details?id=com.dost.wedding&hl=en";
        this.socialSharing.shareViaEmail('Hi there! I am inviting you to join the DOST network, an app for all things wedding! Sign up as a vendor and have access to all the business opportunities around you and connect with your users directly. Use the code "' + this.userdata.invitecode + '" while signing up so you and I can enjoy early bird offers. Cheers!. Enjoy! App Link ' + link, 'Invite Friend', [])
            .then(() => {
                var toast = this.toastCtrl.create({
                    message: "Shared successfully",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            }).catch(() => {
                var toast = this.toastCtrl.create({
                    message: "Sharing via mail is not possible",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            });
    }
    whatsappShare() {
        var link = "https://play.google.com/store/apps/details?id=com.dost.wedding&hl=en";
        this.socialSharing.shareViaWhatsApp('<b>Hi</b> there! I am inviting you to join the DOST network, an app for all things wedding! Sign up as a vendor and have access to all the business opportunities around you and connect with your users directly. Use the code "' + this.userdata.invitecode + '" while signing up so you and I can enjoy early bird offers. Cheers!. Enjoy! App Link ', null /*Image*/, link /* url */)
            .then(() => {
                var toast = this.toastCtrl.create({
                    message: "Shared successfully",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            },
            () => {
                var toast = this.toastCtrl.create({
                    message: "Sharing via whatsapp is not possible",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            })
    }

}


