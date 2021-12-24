import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user = {
    fName: "", 
    lName: "",
    email: "",
    password: ""
  }
  constructor( private accService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(form: Form) {
        //Logic to ensure fields are valid


        
    this.accService.signUp(this.user).subscribe((res:any) => {
      if (res['success']) {
        localStorage.setItem('user', this.user.email);
        this.router.navigate(['/'])
      }
      else {
        alert("invalid username or password")
      }
    })
  }
}
