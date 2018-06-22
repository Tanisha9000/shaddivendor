import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ActionSheetController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ShaadiProvider} from '../../providers/shaadi/shaadi';
import {Geolocation} from '@ionic-native/geolocation';
import {googlemaps} from 'googlemaps';
import {GoogleMaps} from '@ionic-native/google-maps';
import {SocialSharing} from '@ionic-native/social-sharing';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from '@ionic-native/native-geocoder';
import {Camera} from '@ionic-native/camera';
import {MenuPage} from '../menu/menu';
import {Facebook} from '@ionic-native/facebook';
import {GooglePlus} from '@ionic-native/google-plus';
import {Intro} from '../intro/intro';
@IonicPage()
@Component({
    selector: 'page-editprofile',
    templateUrl: 'editprofile.html',
})
export class EditprofilePage implements OnInit {
    respmessage: any;
    image_data = "";
    vendorimage = "assets/image/default_img.jpg"; //displays profile picture
    img: any = []; //holds image url from response gallery
    imglink: any = '' //holds image url from profile picture
    autocompleteItems: any;
    autocomplete = {
        query: ''
    };
    acService: any;
    placesService: any;
    map: any;
    placedetails: any = {
        address: '',
        lat: '',
        lng: '',
    };
    markers = [];
    lat: any;
    long: any;
    userdata: any = [];
    vendortype: any = []; //holds all vendor types
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
        aboutus: '',
        phone: '',

    }
    data = {
        title: '',  //this stores more addons fields
        amount: '',
        category: ''
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
    arr: any = [];
    vendorid: any; //holds splitted vendorid
    name: any; //holds splitted vendor title
    discount: any = [];
    title: any; //holds title of services and details
    service: any = []; //holds services
    service1: any = []; //holds additional services
    moreaddons: any = []; //holds additional addons
    addonvalues: any = []; //holds addons
    responseaddonvalues = []; //stores all addons from api response
    responseservice: any = []; //stores all services from response
    responsehighlight: any = []; //stores all highlights from response 
    subvendor: any = []; //holds subvendor values
    allsubvendors: any = []; //holds all subvendors from response
    anothersub :any=[]; // holds values that needs to be spliced
    highlight: any = []; //holds highlights
    highlight1: any = []; //holds additional highlights
    finalhighlights = []; //stores final highlights
    finaladdons = []; //stores final add ons
    finalservices = []; //stores final services
    finalsubvendors = []; //stores subvendors that are not selected by vendor
    //nameb : ''; //holds value of how did u find about us
    x: number = 0;//holds if there is more button of addon
    y: number = 0; //holds if there is more button of highlights
    bit: number = 0; //bit to show addmore fields
    vbit: number = 0; //bit to show change vendor type
    serv: any = []; //holds services
    addval: any = []; //new array that store title and price of addons
    addval1: any = []; //new array that stores updated additional addons
    high: any = []; //holds selected highlights
    highval: any = []; //holds updated additional highlights
    subvendor1: any = []; //holds selected subvendor values
    userfbresponse: any = []; //stores fb response from local storage
    changemessage: any = ""; //stores message of vendor change
    google_response: any = []; //stores google response

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            if (localStorage.getItem('response_message')) {
                this.respmessage = localStorage.getItem('response_message');
                let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    subTitle: this.respmessage,
                    buttons: ['Dismiss']
                });
                alert.present();
            }
            this.userdata = JSON.parse(localStorage.getItem("user_data"))
            console.log(this.userdata);
            if (this.userdata) {
                this.data.category = this.userdata.vendor_type + '-' + this.userdata.vendor_type_id;
                this.vendorid = this.userdata.vendor_type_id;
                this.placedetails.lat = this.userdata.loc.coordinates[1];
                this.placedetails.lng = this.userdata.loc.coordinates[0];

            }
            this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
            console.log(this.userfbresponse)
            //            alert("Facebook response" + this.userfbresponse)
            if (this.userfbresponse) {
                if (this.userfbresponse.picture) {
                    //                    alert(this.userfbresponse.picture)
                    //  alert(JSON.parse(this.userfbresponse.picture))
                    this.vendorimage = this.userfbresponse.picture.data.url;
                    this.imglink = this.userfbresponse.picture.data.url;
                } else {
                    this.vendorimage = "assets/image/default_img.jpg";
                    this.imglink = "../assets/image/default_img.jpg";
                }
                this.extra.mail = this.userfbresponse.email;
            }
            this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
            //            alert("Google response" + this.google_response)
            if (this.google_response) {
                if (this.google_response.imageUrl) {
                    //                    alert(this.google_response.imageUrl)
                    this.vendorimage = this.google_response.imageUrl;
                    this.imglink = this.google_response.imageUrl;
                } else {
                    this.vendorimage = "/assets/image/default_img.jpg";
                    this.imglink = "../assets/image/default_img.jpg";
                }
            }
            this.getvendordetails();
            this.gettype();
            this.getdetail();
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
        private http: Http,
        public shaadi: ShaadiProvider,
        public googlemaps: GoogleMaps,
        public geolocation: Geolocation,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private socialSharing: SocialSharing,
        private nativeGeocoder: NativeGeocoder,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        public loadingCtrl: LoadingController,
        private fb: Facebook,
        public googleplus: GooglePlus
    ) {

        if (localStorage.getItem('response_message')) {
            this.respmessage = localStorage.getItem('response_message');
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: this.respmessage,
                buttons: ['Dismiss']
            });
            alert.present();
        }
        this.userdata = JSON.parse(localStorage.getItem("user_data"))
        console.log(this.userdata);
        if (this.userdata) {
            this.data.category = this.userdata.vendor_type + '-' + this.userdata.vendor_type_id;
            this.vendorid = this.userdata.vendor_type_id;
            this.placedetails.lat = this.userdata.loc.coordinates[1];
            this.placedetails.lng = this.userdata.loc.coordinates[0];

        }
        this.userfbresponse = JSON.parse(localStorage.getItem('fbresponse'));
        console.log(this.userfbresponse)
        //            alert("Facebook response" + this.userfbresponse)
        if (this.userfbresponse) {
            if (this.userfbresponse.picture) {
                //                    alert(this.userfbresponse.picture)
                //  alert(JSON.parse(this.userfbresponse.picture))
                this.vendorimage = this.userfbresponse.picture.data.url;
                this.imglink = this.userfbresponse.picture.data.url;
            } else {
                this.vendorimage = "assets/image/default_img.jpg";
                this.imglink = "../assets/image/default_img.jpg";
            }
            this.extra.mail = this.userfbresponse.email;
        }
        this.google_response = JSON.parse(localStorage.getItem('googleresponse'));
        //            alert("Google response" + this.google_response)
        if (this.google_response) {
            if (this.google_response.imageUrl) {
                //                    alert(this.google_response.imageUrl)
                this.vendorimage = this.google_response.imageUrl;
                this.imglink = this.google_response.imageUrl;
            } else {
                this.vendorimage = "/assets/image/default_img.jpg";
                this.imglink = "../assets/image/default_img.jpg";
            }
        }
        this.getvendordetails();
        this.gettype();
        this.getdetail();
        this.subvendors();

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditprofilePage');
    }

    ngOnInit() {
        this.userdata = JSON.parse(localStorage.getItem("user_data"))
        console.log(this.userdata);
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
        this.initMap();
    }

    private initMap() {
        this.autocomplete.query = this.userdata.location;
        var point = {lat: parseFloat(this.userdata.loc.coordinates[1]), lng: parseFloat(this.userdata.loc.coordinates[0])};
        console.log(point)
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
            draggable: true
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
                this.map.setCenter(place.geometry.location);
                this.createMapMarker(place);
                // populate
                //                self.address.set = true;
                console.log('page > getPlaceDetail > details > ', this.placedetails);
            } else {
                console.log('page > getPlaceDetail > status > ', status);
            }
        });

    }
    private createMapMarker(place: any): void {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc
        });
        this.markers.push(marker);
    }

    public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
    }

    getvendordetails() {
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
                            this.responseaddonvalues.push({'title': split[j], 'price': ''});
                            console.log(this.responseaddonvalues.length);
                        }
                    }

                }
                if (response.data.services) {
                    for (let t in response.data.services) {
                        this.responseservice.push({'name': response.data.services[t].name, 'pricing': ''});
                    }
                    console.log(this.responseservice)
                }
                console.log(this.responseservice)
                if (response.data.highlights != "") {
                    var high = response.data.highlights;
                    var high1 = high.search(",");
                    if (high1 != -1) {
                        var split = high.split(',');
                        for (let i in split) {
                            this.responsehighlight.push({'title': split[i], 'price': ''});
                        }
                    }
                }

            })
    }
    gettype() {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.get(this.shaadi.base_url + '/vendortypes', options)
            .map(res => res.json())
            .subscribe((data) => {
                console.log(data);
                for (let i in data.data) {
                    this.vendortype.push(data.data[i])
                }
            })
    }
    subvendors() {
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
                    this.allsubvendors.push({'subvendortype_id': response.data[res]._id, 'title': response.data[res].title});
                    this.anothersub.push({'subvendortype_id': response.data[res]._id, 'title': response.data[res].title});
                }
                
                console.log(this.allsubvendors);
                console.log(this.anothersub)
            })

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

                    if (response.data.addon.length > 0) {
                        this.addonvalues = JSON.parse(response.data.addon)
                        console.log(this.responseaddonvalues)
                        console.log(this.addonvalues)

                        for (let data in this.responseaddonvalues) {
                            let index = this.finaladdons.findIndex(x => x.title == this.responseaddonvalues[data].title.trim());
                            if (index == -1) {
                                this.finaladdons.push({title: this.responseaddonvalues[data].title.trim(), price: this.responseaddonvalues[data].price.trim()})
                            }
                        }

                        for (let i in this.addonvalues) {
                            let index = this.finaladdons.findIndex(x => x.title == this.addonvalues[i].title.trim());
                            if (index == -1) {
                                this.finaladdons.push({title: this.addonvalues[i].title.trim(), price: this.addonvalues[i].price.trim()})
                            }
                            if (index != -1 && (this.addonvalues[i].price != this.finaladdons[index].price)) {
                                this.finaladdons[index].price = this.addonvalues[i].price;
                                //this.finaladdons[].push({title:this.addonvalues[i].title.trim(), price: this.addonvalues[i].price.trim() })
                            }
                        }
                        console.log(this.finaladdons)
                    }
                    if (response.data.highlights.length > 0) {
                        this.highlight = JSON.parse(response.data.highlights)
                        console.log(this.responsehighlight)
                        console.log(this.highlight)

                        for (let data in this.responsehighlight) {
                            let index = this.finalhighlights.findIndex(x => x.title == this.responsehighlight[data].title.trim());
                            console.log(index)
                            if (index == -1) {
                                this.finalhighlights.push({title: this.responsehighlight[data].title.trim(), price: this.responsehighlight[data].price.trim()})
                            }
                        }

                        setTimeout(() => {

                            for (let i in this.highlight) {
                                let index = this.finalhighlights.findIndex(x => x.title == this.highlight[i].title.trim());
                                if (index == -1) {

                                    this.finalhighlights.push({title: this.highlight[i].title.trim(), price: this.highlight[i].price.trim()})
                                    console.log(this.finalhighlights)
                                }
                                if (index != -1 && (this.highlight[i].price != this.finalhighlights[index].price)) {
                                    this.finalhighlights[index].price = this.highlight[i].price;
                                }
                            }
                        }, 2000);

                        console.log(this.finalhighlights)

                    }
                    if (response.data.subvendortypes.length > 0) {
                        this.subvendor = JSON.parse(response.data.subvendortypes);
                        console.log(this.anothersub)
                        console.log(this.subvendor)
                        setTimeout(() => {
                            for (let sub in this.anothersub) {
                                this.subvendor[sub].checkkk = true;
                                console.log('tani')
                                let index = this.anothersub.findIndex(z => z.subvendortype_id == this.subvendor[sub].subvendortype_id);
                                console.log(index)
                                if (index != -1) {
                                    console.log('splice')
                                    this.anothersub.splice(index, 1);
                                    //  this.finalsubvendors.push({'subvendortype_id': this.allsubvendors[sub].subvendortype_id, 'title': this.allsubvendors[sub].title})
                                }
                            }
                        }, 6000);
                        console.log(this.anothersub)
                    }
                    if (response.data.additional_addon.length > 0) {
                        this.moreaddons = JSON.parse(response.data.additional_addon)
                    }
                    if (response.data.additional_highlights.length > 0) {
                        this.highlight1 = JSON.parse(response.data.additional_highlights)
                    }

                    if (response.data.services.length > 0) {
                        this.service = JSON.parse(response.data.services)
                        console.log(this.service)
                        console.log(this.responseservice)
                        console.log(this.finalservices)
                        for (let ser in this.responseservice) {
                            let index = this.finalservices.findIndex(y => y.name == this.responseservice[ser].name);
                            if (index == -1) {
                                this.finalservices.push({name: this.responseservice[ser].title, pricing: this.responseservice[ser].pricing})
                                console.log(this.finalservices)
                            }
                        }
                        for (let data in this.service) {
                            let index = this.finalservices.findIndex(x => x.name == this.service[data].name);
                            if (index == -1) {
                                this.finalservices.push({name: this.service[data].name, pricing: this.service[data].pricing})
                            }
                            if (index != -1 && (this.service[data].pricing != this.service[index].price)) {
                                this.finalservices[index].pricing = this.finalservices[data].pricing;
                            }

                        }
                        console.log(this.finalservices)
                    }

                    if (response.data.additional_services.length > 0) {
                        this.service1 = JSON.parse(response.data.additional_services)
                    }



                    if (response.data.discount) {
                        this.discount = JSON.parse(response.data.discount)
                    }
                    if (response.data.gallery) {
                        this.img = JSON.parse(response.data.gallery);
                    }
                    ////          this.nameb = response.data.find_us;
                    if (response.data.effective_date != "undefined") {
                        this.extra.edate = response.data.effective_date;
                    }
                    if (response.data.discount_amount != "undefined") {
                        this.extra.damount = response.data.discount_amount;
                    }
                    this.name = response.data.vendor_type;
                    this.extra.cname = response.data.company_name;
                    this.extra.price = response.data.minimum_price;
                    this.extra.mail = response.data.email;
                    this.extra.phone = response.data.phone;
                    this.extra.year = response.data.establishment_year;
                    this.extra.starthour = response.data.start_hours;
                    this.extra.endhour = response.data.end_hours;
                    if (response.data.facebook_username != "undefined") {
                        this.extra.facebuk = response.data.facebook_username;
                    }
                    if (response.data.twitter_username != "undefined") {
                        this.extra.twiter = response.data.twitter_username;
                    }
                    if (response.data.instagram_username != "undefined") {
                        this.extra.insta = response.data.instagram_username;
                    }
                    this.extra.award = response.data.awards;
                    this.extra.aboutus = response.data.about_us;
                    if (response.data.instagram_username != "undefined") {
                        this.extra.pdetail = response.data.product_detail;
                    }
                    if (response.data.image != "null" || response.data.image != null || response.data.image != "" || response.data.image != "assetsimagedefault_img.jpg") {
                        this.vendorimage = response.data.image;
                        this.imglink = response.data.image;
                    } else {
                        this.vendorimage = "assets/image/default_img.jpg";
                        this.imglink = "../assets/image/default_img.jpg";
                    }
                }
            })
    }

    changevendor() {
        //        this.changemessage = "Changing your vendor type will result in loss of data, like add-ons etc."
        let alert = this.alertCtrl.create({
            title: 'Confirm',
            message: 'Changing your vendor type will result in loss of data, like add-ons etc.',
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
                        this.vbit = 1;
                    }
                }
            ]
        });
        alert.present();
    }

    changetype(vendorcategory) {
        let alert = this.alertCtrl.create({
            title: 'Confirm the Change',
            message: 'Do you want to change vendor type?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');

                    }
                },
                {
                    text: 'Change',
                    handler: () => {
                        console.log('change clicked');
                        var split = vendorcategory.split('-');
                        this.vendorid = split[1];
                        this.name = split[0];
                        this.getsinglevendor();
                        this.getsubvendors();
                        this.againMapLoad();
                    }
                }
            ]
        });
        alert.present();
    }
    private againMapLoad() {
        this.geolocation.getCurrentPosition().then(res => {
            var latitude = res.coords.latitude
            var longitude = res.coords.longitude
            var point = {lat: latitude, lng: longitude};
            let divMap = (<HTMLInputElement> document.getElementById('map'));
            this.map = new google.maps.Map(divMap, {
                center: point,
                zoom: 15,
                disableDefaultUI: true,
                draggable: true,
                zoomControl: true
            });

            let marker = new google.maps.Marker({
                position: {
                    lat: latitude,
                    lng: longitude
                },
                map: this.map,
                draggable: true
            });

            marker.addListener('dragend', () => {
                var pos = marker.getPosition();
                console.log(pos)
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

    getsinglevendor() {
        this.autocomplete.query = "";
        this.img = [];
        this.moreaddons = [];
        this.highlight1 = [];
        this.service1 = [];
        this.service = [];
        this.finalservices = [];
        this.addonvalues = [];
        this.finaladdons = [];
        this.highlight = [];
        this.finalhighlights = [];
        this.discount = [];
        this.subvendor = [];
        this.extra = {
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
            aboutus: '',
            phone: this.extra.phone
        }
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };

        var postdata = {
            id: this.vendorid,
        }
        console.log(postdata);
        var serialized_all = this.serializeObj(postdata);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
        let options = new RequestOptions({headers: headers});
        this.http.post(this.shaadi.base_url + '/vendortypes/typebyid', serialized_all, options)
            .map(res => res.json())
            .subscribe((response) => {
                console.log(response);
                this.name = response.data.title;
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
                        this.finaladdons = this.addonvalues;
                        console.log(this.finaladdons);
                    }
                }
                if (response.data.services) {
                    for (let t in response.data.services) {
                        this.service.push({'name': response.data.services[t].name, 'pricing': ''});
                    }
                    this.finalservices = this.service;
                }

                if (response.data.highlights != "") {
                    var high = response.data.highlights;
                    var high1 = high.search(",");
                    if (high1 != -1) {
                        var split = high.split(',');
                        for (let i in split) {
                            this.highlight.push({'title': split[i], 'price': ''});
                        }
                        this.finalhighlights = this.highlight;
                    }
                }
            })
    }

    getsubvendors() {
        var postdata1 = {
            id: this.vendorid,
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

    presentActionSheet(bit) {
        const actionsheet = this.actionSheetCtrl.create({
            title: "Profile Photo",
            cssClass: 'title',
            buttons: [
                {
                    text: 'Gallery',
                    icon: 'images',
                    handler: () => {
                        this.getPicture(0, bit); // 0 == Library
                    }
                }, {
                    text: 'Take Photo',
                    icon: 'camera',
                    handler: () => {
                        this.getPicture(1, bit); // 1 == Camera
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
                        //                        alert(JSON.stringify(this.imglink))
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
                        //                        alert(this.img)
                        //                        alert(JSON.stringify(this.img))
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

    adddisc() {
        if (this.disc.titlee != '' || this.disc.amountt != '' || this.disc.dayy != '') {
            this.discount.push({'title': this.disc.titlee, 'price': this.disc.amountt, 'day': this.disc.dayy});
            console.log(this.discount)
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

    //    displayamt1(ch, i, pr) {
    //        console.log("checkbox is" + ch);
    //        console.log("price is" + pr);
    //        console.log("index is" + i);
    //        if (ch == false) {
    //            this.highlight[i].price = '';
    //        }
    //    }
    //
    //    displayamt(pr, ch, i) {
    //        console.log("checked :" + ch);
    //        console.log("index is " + i);
    //        console.log(this.finaladdons[i]);
    //        console.log(this.finaladdons);
    //        console.log(this.finaladdons[i].price);
    //       
    //        if (ch == false) {
    //            this.finaladdons[i].price = '';
    //        }
    //    }

    add() {
        if (this.data.title == "" || this.data.amount == "") {
            let alert = this.alertCtrl.create({
                title: 'Alert',
                subTitle: 'Please enter the data first',
                buttons: ['Ok']
            })
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

    publish(frmdata) {
        //      alert('abc')
        //      console.log('abc')
        if (this.userdata.phone != this.extra.phone) {
            let alert = this.alertCtrl.create({
                title: 'Confirm',
                message: 'It seems that you have changed your phone number.Are you sure you want to change it?If yes,you need to login again.',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            console.log('No clicked');

                            if (this.finaladdons.length > 0) {
                                for (let addy in this.finaladdons) {
                                    if (this.finaladdons[addy].check == true) {
                                        this.addval.push({'title': this.finaladdons[addy].title, 'price': this.finaladdons[addy].price});
                                    }
                                }
                                console.log("add-ons" + JSON.stringify(this.addval));
                            }
                            if (this.moreaddons.length > 0) {
                                for (let a in this.moreaddons) {
                                    if (this.moreaddons[a].check1 == true) {
                                        this.addval1.push({'title': this.moreaddons[a].title, 'price': this.moreaddons[a].price});
                                    }
                                }
                                console.log("additional add-ons" + JSON.stringify(this.addval1));
                            }
                            if (this.finalservices.length > 0) {
                                for (let frm in this.finalservices) {
                                    if (this.finalservices[frm].pri != "" && this.finalservices[frm].pri != undefined) {
                                        console.log(this.service[frm].name)
                                        this.serv.push({'name': this.service[frm].name, 'pricing': this.service[frm].pri});
                                    }
                                    console.log("services" + JSON.stringify(this.serv));
                                }
                            }

                            if (this.finalhighlights.length > 0) {
                                for (let hi in this.finalhighlights) {
                                    if (this.finalhighlights[hi].chec == true) {
                                        this.high.push({'title': this.finalhighlights[hi].title, 'price': this.finalhighlights[hi].price});
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
                                //  console.log(this.subvendor1);
                            }
                            if (this.anothersub.length > 0) {
                                for (let sub1 in this.anothersub) {
                                    if (this.anothersub[sub1].checkboxx == true) {
                                        this.subvendor1.push({'subvendortype_id': this.anothersub[sub1].subvendortype_id, 'title': this.anothersub[sub1].title});
                                    }
                                }
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
                                discount: JSON.stringify(this.discount),
                                discount_amount: frmdata.value.damount,
                                effective_date: frmdata.value.edate,
                                product_detail: frmdata.value.pdetail,
                                awards: frmdata.value.award,
                                vendor_type: this.name,
                                vendor_type_id: this.vendorid,
                                phone: this.extra.phone,
                                company_name: frmdata.value.cname,
                                about_us: frmdata.value.aboutus,
                                minimum_price: frmdata.value.price,
                                image: this.imglink,
                                gallery: JSON.stringify(this.img, null, ''),
                                additional_addon: JSON.stringify(this.addval1),
                                addon: JSON.stringify(this.addval),
                                highlights: JSON.stringify(this.high),
                                additional_highlights: JSON.stringify(this.highval),
                                additional_services: JSON.stringify(this.service1),
                                services: JSON.stringify(this.serv),
                                subvendortypes: JSON.stringify(this.subvendor1),
                                status: this.userdata.status,
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
                                    if (response.status == true) {
                                        localStorage.setItem("user_data", JSON.stringify(response.data))
                                        this.navCtrl.setRoot(MenuPage);
                                    }
                                })
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Yes clicked');
                            this.fb.logout().then((res) =>
                                console.log('Logged into Facebook!', res)).catch(e =>
                                    console.log('Error logging into Facebook', e));
                            this.googleplus.logout().then((res) =>
                                console.log('logged out of google', res)).catch(err =>
                                    console.error(err));
                            localStorage.clear();
                            this.navCtrl.setRoot(Intro);

                        }
                    }
                ]
            });
            alert.present();
        } else {
            if (this.finaladdons.length > 0) {
                for (let addy in this.finaladdons) {
                    if (this.finaladdons[addy].check == true) {
                        this.addval.push({'title': this.finaladdons[addy].title, 'price': this.finaladdons[addy].price});
                    }
                }
                console.log("add-ons" + JSON.stringify(this.addval));
            }
            if (this.moreaddons.length > 0) {
                for (let a in this.moreaddons) {
                    if (this.moreaddons[a].check1 == true) {
                        this.addval1.push({'title': this.moreaddons[a].title, 'price': this.moreaddons[a].price});
                    }
                }
                console.log("additional add-ons" + JSON.stringify(this.addval1));
            }
            if (this.finalservices.length > 0) {
                for (let frm in this.finalservices) {
                    if (this.finalservices[frm].pri != "" && this.finalservices[frm].pri != undefined) {
                        console.log(this.service[frm].name)
                        this.serv.push({'name': this.service[frm].name, 'pricing': this.service[frm].pri});
                    }
                    console.log("services" + JSON.stringify(this.serv));
                }
            }

            if (this.finalhighlights.length > 0) {
                for (let hi in this.finalhighlights) {
                    if (this.finalhighlights[hi].chec == true) {
                        this.high.push({'title': this.finalhighlights[hi].title, 'price': this.finalhighlights[hi].price});
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
                //  console.log(this.subvendor1);
            }
            if (this.anothersub.length > 0) {
                for (let sub1 in this.anothersub) {
                    if (this.anothersub[sub1].checkboxx == true) {
                        this.subvendor1.push({'subvendortype_id': this.anothersub[sub1].subvendortype_id, 'title': this.anothersub[sub1].title});
                    }
                }
            }
            console.log(this.subvendor1)
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
                discount: JSON.stringify(this.discount),
                discount_amount: frmdata.value.damount,
                effective_date: frmdata.value.edate,
                product_detail: frmdata.value.pdetail,
                awards: frmdata.value.award,
                vendor_type: this.name,
                vendor_type_id: this.vendorid,
                phone: this.extra.phone,
                company_name: frmdata.value.cname,
                about_us: frmdata.value.aboutus,
                minimum_price: frmdata.value.price,
                image: this.imglink,
                gallery: JSON.stringify(this.img, null, ''),
                additional_addon: JSON.stringify(this.addval1),
                addon: JSON.stringify(this.addval),
                highlights: JSON.stringify(this.high),
                additional_highlights: JSON.stringify(this.highval),
                additional_services: JSON.stringify(this.service1),
                services: JSON.stringify(this.serv),
                subvendortypes: JSON.stringify(this.subvendor1),
                status: this.userdata.status,
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
                    if (response.status == true) {
                        localStorage.setItem("user_data", JSON.stringify(response.data))
                        this.navCtrl.setRoot(MenuPage);
                    }
                })

        }

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
