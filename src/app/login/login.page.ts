import { Component, OnInit } from "@angular/core";
import { NavController,  LoadingController, ToastController, Platform } from "@ionic/angular";
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  public showPassword: boolean = true;
  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private config:ConfigService,
    public http: HttpClient,
    public platform: Platform,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  openPage(page: any) {
    this.navCtrl.navigateForward(page);
  }

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'At least 5 characters long.' },
    ],

    
  };

  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(values){

    let data: any;
    const url = this.config.domainURL + 'login';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });
    data = this.http.post(url,values);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result); 

        if (result.status === "1") {
          this.authService.login()

          // console.log(result.data[0].user_id);

          localStorage.setItem('lsUserID',result.data[0].user_id);
          localStorage.setItem('lsUserName',result.data[0].name);
          localStorage.setItem('lsEmail',result.data[0].email);
          localStorage.setItem('lsuserMobile',result.data[0].user_mobile);
          localStorage.setItem('lsAPIToken',result.data[0].api_token);



          // this.storage.set('lsUserID', result.data[0].id);
          // this.storage.set('lsUserName', result.data[0].name);
          // this.storage.set('lsEmail',  result.data[0].email);
          // this.storage.set('lsPassword', result.data[0].password);
          // this.storage.set('lsMobileNo',  result.data[0].mobile);
          
         //this.router.navigateByUrl('/tabs');
         this.router.navigateByUrl('tabs');

          this.presentToast(result.message);
          loading.dismiss();

        }
         else if (result.status === "0") {
          // alert("else");
          this.presentToast(result.message);
          loading.dismiss();
        } 

        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });

    this.validations_form.reset(); 
    
  }


  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      showCloseButton : true,
    });
    toast.present();
  }

}
