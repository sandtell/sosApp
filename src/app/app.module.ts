import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    AuthGuardService,
    AuthenticationService,
    CallNumber,
    ScreenOrientation,
    Shake,
    Geolocation,
    AndroidPermissions,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
