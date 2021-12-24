import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  errorMessage = "Invalid entry. Please fill out entire form."
  notValid = false;
  user =  new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(2)]),
    password: new FormControl("", [Validators.required, Validators.minLength(2)]),
    fName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    lName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(24)])
  })

  constructor( private accService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit() {
        //Logic to ensure fields are valid
    if (this.user.valid) {
      this.accService.signUp(this.user.value).subscribe((res:any) => {
        if (res['success']) {
          localStorage.setItem('user', (this.user.get('username')?.toString() || ""));
          this.router.navigate(['/'])
        }
        else {
          console.log(res)
          this.notValid = true;
        }
      }, (err) => {
        this.errorMessage = err.error.message
        this.notValid = true
      })
    }
    else {
      this.notValid = true;
      console.log("EE")
    }
    
  }
}
