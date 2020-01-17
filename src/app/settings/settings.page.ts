import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  validations_form: FormGroup;
  constructor(
    private storage: Storage,
    private router: Router,
    private config:ConfigService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private contacts: Contacts
  ) { }


  getContact(variable) {
    let remove91;   
    this.contacts.pickContact().then((contact) => {
        // alert('displayName = ' + contact.displayName);
        // alert('phoneNumbers = ' + contact.phoneNumbers[0].value);
        remove91 = contact.phoneNumbers[0].value.replace('+91','');
        if(variable === "mobile1") {
          this.validations_form.controls['altMobNo'].setValue(remove91.replace(/\s/g,''));
        }else if (variable =="mobile2") {
          this.validations_form.controls['altMobNo2'].setValue(remove91.replace(/\s/g,''));
        }
    });
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({   
      altMobNo: new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      altMobNo2: new FormControl(''),
      altEmail: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      altEmail2 : new FormControl(''),
    });
  }


  ionViewDidEnter(){
    // console.log(localStorage.getItem('lsUserID'));
    this.getSettingsData();    
  }

  validation_messages = {
    altMobNo :[
      { type: 'required', message: 'Alternative number is required.' },
      { type: 'minlength', message: 'Mobile No must be at least 10' },
      { type: 'maxlength', message: 'Mobile No cannot be more than 10' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ],
    altEmail :[
      { type: 'required', message: 'Alternative Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ]    
  };

  async getSettingsData() {
    // console.log(localStorage.getItem('lsEmail'));
    const apiToken = localStorage.getItem('lsAPIToken');
    const userEmailID = localStorage.getItem('lsEmail');
    const headers = new HttpHeaders().set('Api_Token', apiToken).set('User_Email', userEmailID);
    let data: Observable<any>;
    let url = this.config.domainURL + 'setting';
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner : 'bubbles',
    });
    data = this.http.get(url, { headers: headers });
    loading.present().then(() => {
      data.subscribe(result => {
        // console.log(result.data.mail);
        if (result.data.mobile[0].mobile != '' || result.data.mobile[0].mobile != undefined || result.data.mobile[0].mobile != null) {
          this.validations_form.controls['altMobNo'].setValue(result.data.mobile[0].mobile);
          this.validations_form.controls['altMobNo2'].setValue(result.data.mobile[1].mobile);
        }

        if (result.data.mobile[0].mail != '' || result.data.mobile[0].mail != undefined || result.data.mobile[0].mail != null) {
          this.validations_form.controls['altEmail'].setValue(result.data.mail[0].mail);
          this.validations_form.controls['altEmail2'].setValue(result.data.mail[1].mail);
        }

        console.log(result);
        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });

  }

 async onSubmit(values){
    const apiToken = localStorage.getItem('lsAPIToken');
    const userEmailID = localStorage.getItem('lsEmail');
    const headers = new HttpHeaders().set('Api_Token', apiToken).set('User_Email', userEmailID);
    let data: Observable<any>;
    let url = this.config.domainURL + 'setting';
    const loading = await this.loadingCtrl.create({
      message: 'Upading...',
      spinner : 'bubbles',
    });
    data = this.http.post(url,values, { headers: headers });
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

  logOutFn(){
    localStorage.clear();
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.router.navigateByUrl('/login');
  }

}
