import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Urls } from '../constants/url.constant';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: any = '';
  userDetails: any = null;
  pass: any = '';
  secret = "CIPHERKEY";

  constructor(private http: HttpClient) { }

  login(email: any, password: any): Observable<any>{
    const req = {
      "email":email,
      "password":password
    }
    return this.http.post(Urls.base_url + Urls.login, req);
  }

  getEncrypt(value: any) {
    let cipher = CryptoJS.DES.encrypt(value, this.secret);
    return cipher.toString();
   // return value;
  }

  getDecrypt(value: any) {
    var decipher = CryptoJS.DES.decrypt(value, this.secret);
    return decipher.toString(CryptoJS.enc.Utf8);
   // return value;
  }
}
