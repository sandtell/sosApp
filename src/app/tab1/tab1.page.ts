import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ConfigService } from '../services/config.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  locationCoords: any;
  
  public isShow:boolean = false;
  constructor(
    private callNumber: CallNumber,
    private shake: Shake,
    private plt : Platform,
    private androidPermissions : AndroidPermissions,
    private locationAccuracy :LocationAccuracy,
    private geolocation : Geolocation,
    private config : ConfigService
    )
   {
    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
   
   }

  ngOnInit() {

    console.log(this.config.userID);

    // this.checkGPSPermission();

    this.plt.ready().then(() => {
      const watch = this.shake.startWatch(60).subscribe(() => {
        alert('shake working');
        this.isShow = true;
        this.getLocationCoordinates();
      });
      // watch.unsubscribe();      
    });
  }

   callFn(number) {
    this.callNumber.callNumber(number, true).then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  sendSMSEmail(){
    this.isShow = true;
    this.getLocationCoordinates();
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
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;

      console.log(this.locationCoords);

    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }

   

  // logOutFn(){
  //   this.storage.clear().then(() => {
  //     console.log('all keys are cleared');
  //   });
  //   this.router.navigateByUrl('/login');
  // }
}
