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
  allMessages!: any
  constructor(public dialog: MatDialog, private messageService: MessageService, public accService: AccountService) { }

  ngOnInit(): void {
    this.messageService.getMessages().subscribe((res:any) => {
      console.log(res)
      res.messages.forEach((message:any) => {
        let date = new Date(message.timestamp)
        console.log(date.toLocaleDateString())
        message.timestamp = date.toLocaleDateString() + " - " + date.toLocaleTimeString()
      })
      this.allMessages = res.messages
    })
  }
  deletePost(event:String) {
    let index = this.allMessages.findIndex((ele:any) => ele._id == event)
    console.log(index)
    console.log(this.allMessages)
    this.allMessages.splice(index, 1)
    console.log(this.allMessages)
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '300px',
      data: {message: this.message},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      this.message = result;
      if (this.accService.isLoggedIn() && this.message) {
        this.messageService.postMessage(this.accService.getUsername(), this.message).subscribe((res:any) => {
          res.post.createdBy = { username: this.accService.getUsername()}
          let date = new Date(res.post.timestamp)
          res.post.timestamp = date.toLocaleDateString() + " - " + date.toLocaleTimeString()
          this.allMessages.push(res.post)
          console.log(res.post)
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
