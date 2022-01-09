import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountService } from '../services/account.service';
import { MessageService } from '../services/message.service';
export interface DialogData {
  message: string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message!: string;
  statusMessage = "Membership status changed: Member"
  statusChanged = false;
  allMessages!: any
  constructor(public dialog: MatDialog, private messageService: MessageService, public accService: AccountService) { }

  ngOnInit(): void {
    this.getMessages();
  }
  getMessages() {
    this.messageService.getMessages().subscribe((res:any) => {
      res.messages.forEach((message:any) => {
        let date = new Date(message.timestamp)

        message.timestamp = date.toLocaleDateString() + " - " + date.toLocaleTimeString()
      })
      this.allMessages = res.messages
    })
  }
  deletePost(event:String) {
    let index = this.allMessages.findIndex((ele:any) => ele._id == event)
  
    this.allMessages.splice(index, 1)
  }
  becomeMember() {
    if (localStorage.getItem('role') == 'noob') {
      this.accService.changeMembership(localStorage.getItem("user") || "").subscribe((res) => {

        localStorage.setItem('role', 'member');
        this.getMessages();
        this.statusChanged = true;
        setTimeout((() => this.statusChanged = false), 3000);
      })
    }
    else {
      this.statusMessage = "Unavailable. You are a/an " + localStorage.getItem("role");
      this.statusChanged = true;
      setTimeout((() => this.statusChanged = false), 3000);
    }
    
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '300px',
      data: {message: this.message},
    });

    dialogRef.afterClosed().subscribe(result => {


      this.message = result;
      if (this.accService.isLoggedIn() && this.message) {
        this.messageService.postMessage(this.accService.getUsername(), this.message).subscribe((res:any) => {
          res.post.createdBy = { username: this.accService.getUsername()}
          let date = new Date(res.post.timestamp)
          res.post.timestamp = date.toLocaleDateString() + " - " + date.toLocaleTimeString()
          this.allMessages.push(res.post)
        })
      }
      this.message = ""
      
    });
  }
}

@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.html',
})
export class MessageDialog {
    message!: string
    isEmpty = true
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }


}
