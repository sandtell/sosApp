import { Component, OnInit   } from '@angular/core'; 
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'], 
})
export class Tab3Page implements OnInit  {

  validations_form: FormGroup;
  constructor(
    private config:ConfigService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
  ) { 

  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      message : new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  validation_messages = {
    message: [
      { type: 'required', message: 'Message is required.' },
    ],
    
  };

  ionViewDidEnter() {
    this.getSetMessage("","load","Please Wait ...");
  }

  async getSetMessage(values,mode,msg) {

    console.log(localStorage.getItem('lsAPIToken'));

    const apiToken = localStorage.getItem('lsAPIToken');
    const userEmailID = localStorage.getItem('lsEmail');

    const headers = new HttpHeaders().set('Api_Token', apiToken).set('User_Email', userEmailID);
    let data: Observable<any>;
    let url = this.config.domainURL + 'message';
    const loading = await this.loadingCtrl.create({
      message: msg,
      spinner : 'bubbles',
    });

    data = this.http.post(url,values, { headers: headers });
    loading.present().then(() => {
      data.subscribe(result => {

        if(mode === "load"){
          this.validations_form.controls['message'].setValue(result.data.message);
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
      console.log(values);
      this.getSetMessage(values,"submit","Updating");
  }

}
