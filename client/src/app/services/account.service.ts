import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  prefixURL = "/api"
  constructor(private http: HttpClient) { }
  signUp(credentials: Object) {
    console.log(credentials)
    return this.http.post(this.prefixURL + "/sign-up", credentials);
  }
  logIn(credentials: Object) {
    return this.http.post(this.prefixURL + "/log-in", credentials);
  }
  isLoggedIn() {
    return (localStorage.getItem("user") ? true : false)
  }
}
