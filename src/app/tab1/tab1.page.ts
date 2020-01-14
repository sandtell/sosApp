import { Component } from '@angular/core';
// import { Storage } from '@ionic/storage';
// import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private callNumber: CallNumber,
    private shake: Shake,
    private plt : Platform
    )
   {
   }

  ngOnInit() {
    this.plt.ready().then(() => {
      const watch = this.shake.startWatch(60).subscribe(() => {
        alert('shake working');
      });
      // watch.unsubscribe();

      this.shake.startWatch().subscribe(() => {
        alert('shake working');
      });
    });

  }

   callFn(number) {
    this.callNumber.callNumber(number, true).then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }


   

  // logOutFn(){
  //   this.storage.clear().then(() => {
  //     console.log('all keys are cleared');
  //   });
  //   this.router.navigateByUrl('/login');
  // }
}
