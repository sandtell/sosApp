import { Component , OnInit, ViewChild, ElementRef } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";
declare var google;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('map', {static : true }) mapElement: ElementRef;
  private options: GeolocationOptions;
  private currentPos: Geoposition;
  private userLat: any;
  private userLong: any;
  private map: any;

  emergency: any;
  
  public isShow:boolean = false;
  constructor(
    private callNumber: CallNumber,
    private shake: Shake,
    private plt : Platform,
    private androidPermissions : AndroidPermissions,
    private locationAccuracy :LocationAccuracy,
    private geolocation : Geolocation,
    private config : ConfigService,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertController: AlertController
    )
   {
    this.emergency = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: "",
    }
   
   }

  ngOnInit() {

    console.log(localStorage.getItem('lsUserID'));
    // console.log(this.config.userID);
 
    this.getUserPosition();

    this.plt.ready().then(() => {
      const watch = this.shake.startWatch(60).subscribe(() => {
        alert('shake working');
        this.isShow = true;
        // this.getLocationCoordinates();
        this.callEmergencyFn(this.emergency);
      });
      // watch.unsubscribe();      
    });
  }


  getUserPosition() {
    this.options = {
      enableHighAccuracy : true
    };
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.currentPos = pos;
      this.userLat = pos.coords.latitude;
      this.userLong = pos.coords.longitude;
      this.addMap(pos.coords.latitude, pos.coords.longitude);
    }, (err: PositionError) => {
      console.log('error: ' + err.message);
    });
  }

  addMap(lat, long) {
    const latLng = new google.maps.LatLng(lat, long);

    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

  addMarker() {
    // const userMarker = 'assets/img/custom_icon.jpg';
    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      // icon: userMarker
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.presentAlert();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'My Location',
      subHeader: '',
      message: 'latitude: ' + this.userLat + '<br>Longitude: ' + this.userLong,
      buttons: ['OK']
    });

    await alert.present();
  }

   callFn(number) {
    this.callNumber.callNumber(number, true).then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  sendSMSEmail(){
    this.isShow = true;
    // this.getLocationCoordinates();
    this.callEmergencyFn(this.emergency);
  }


  

   
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.emergency.latitude = resp.coords.latitude;
      this.emergency.longitude = resp.coords.longitude;
      this.emergency.accuracy = resp.coords.accuracy;
      this.emergency.timestamp = resp.timestamp;
      // this.emergency.userID = localStorage.getItem('lsUserID');
      // this.emergency.apiToken = localStorage.getItem('lsAPIToken');
      
      console.log(this.emergency);
      

    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }


  async callEmergencyFn(formData) {

    console.log(localStorage.getItem('lsEmail'));

    const apiToken = localStorage.getItem('lsAPIToken');
    const userEmailID = localStorage.getItem('lsEmail');

    const headers = new HttpHeaders().set('Api_Token', apiToken).set('User_Email', userEmailID);
    let data: Observable<any>;
    let url = this.config.domainURL + 'emergency';
    const loading = await this.loadingCtrl.create({
      message: 'Calling...',
      spinner : 'bubbles',
    });

    data = this.http.post(url, formData, { headers: headers });
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }
   



  // logOutFn(){
  //   this.storage.clear().then(() => {
  //     console.log('all keys are cleared');
  //   });
  //   this.router.navigateByUrl('/login');
  // }
}
