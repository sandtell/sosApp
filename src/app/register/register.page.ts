import { Component, OnInit , ViewEncapsulation  } from "@angular/core";
import { LoadingController, ToastController,AlertController  } from "@ionic/angular";
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  public showPassword: boolean = true;
 
  constructor(    
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private router: Router,
    private config:ConfigService,
    public http: HttpClient,
    private authService: AuthenticationService
  ) {
  

  }

  ngOnInit() { 
    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]{2,30}$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      mobileNo: new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
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

  validation_messages = {
    username: [
      { type: 'required', message: 'Name is required.' },
      { type: 'pattern', message: 'Number are not allowed' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    gender: [
      { type: 'required', message: 'Gender is required.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'At least 5 characters long.' },
    ],
    mobileNo: [
      { type: 'required', message: 'Mobile number is required.' },
      { type: 'minlength', message: 'Mobile No must be at least 10' },
      { type: 'maxlength', message: 'Mobile No cannot be more than 10' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ],
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

  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(values) {
    // let data: any;
    // const url = this.config.domainURL + 'signup';
    // const loading = await this.loadingCtrl.create({
    //   spinner : 'bubbles',
    //   message: 'Creating New User ...',
    // });
    // data = this.http.post(url, values);
    // loading.present().then(() => {
    //   data.subscribe(result => {
    //     console.log(result);

    //     if (result.status === "1") {
    //       this.authService.login()
    //       localStorage.setItem('lsUserID', result.data.user_id);
    //       localStorage.setItem('lsUserName', result.data.user_name);
    //       localStorage.setItem('lsEmail', result.data.user_email);
    //       localStorage.setItem('lsMobileNo', result.data.user_mobile);
    //       this.router.navigateByUrl('tabs');
    //       this.presentToast(result.message);
    //     } else if (result.status === "0") {
    //       this.presentToast(result.message);
    //     }

        
    //     loading.dismiss();
    //   });
    //   return loading.present();
    // }, error => {
    //   console.log(error);
    //   loading.dismiss();
    // });

    // this.validations_form.reset();

    console.log(values);

  }

   


  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
 



}
