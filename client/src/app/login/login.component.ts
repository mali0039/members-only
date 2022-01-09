import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  notValid = false
  errorMessage = "Invalid entry. Please fill out entire form."

  user =  new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
    password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(24)])
  })
  constructor(private accService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    //Logic to ensure fields are valid
    if (this.user.valid) {
      this.accService.logIn(this.user.value).subscribe((res:any) => {
        if (res['success']) {
          this.accService.setUsername(this.user.get("username")?.value)
          this.accService.setRole(res['status']);
          this.router.navigate(['/'])
        }
        else {
          this.notValid = true;
        }
      }, (err => {
        if (err.status == 401) {
          this.errorMessage = "Invalid username or password."
          this.notValid = true;
        }

      }))
    }
    else {
      this.notValid = true;
    }
    
  }
}
