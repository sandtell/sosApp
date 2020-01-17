import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
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

    this.checkGPSPermission();

    this.loadMap();

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


  loadMap() {

    let lat;
    let lng;
    this.geolocation.getCurrentPosition().then((position) => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    });

    let map = GoogleMaps.create('map');

    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      
      let coordinates: LatLng = new LatLng(lat, lng);

      // alert(coordinates);

      let position = {
        target: coordinates,
        zoom: 14
      };

      map.animateCamera(position);

      let markerOptions: MarkerOptions = {
        position: coordinates,
        icon: "../../assets/location.PNG",
        title: 'Your Current Location'
      };

      const marker = map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });
    })
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


  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) { 
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else { 
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
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
