import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public domainURL = 'https://sos.brilienzacademy.in/api/';
  public userID;
  constructor() {
    this.userID = localStorage.getItem('lsUserID');
   }
}
