import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  prefixURL = "/api"

  postMessage(username: string, message: string) {
    return this.http.post(this.prefixURL + "/message", {username, message})
  }
  getMessages() {
    return this.http.get(this.prefixURL + "/messages")
  }
  constructor(private http: HttpClient) { }
}
