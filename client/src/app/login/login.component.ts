import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = {
    username: "",
    password: ""
  }
  constructor(private accService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: Form) {
    //Logic to ensure fields are valid


    this.accService.logIn(this.user).subscribe((res:any) => {
      if (res['success']) {
        localStorage.setItem('user', this.user.username);
        this.router.navigate(['/'])
      }
      else {
        console.log("FAILED")
      }
    })
  }
}
