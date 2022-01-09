import { Component } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'members-only';
  constructor(public accService : AccountService){}

  logOut() {
    this.accService.logOut().subscribe((res) => {
    })
  }
}
