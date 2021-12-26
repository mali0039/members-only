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
    this.messageService.getMessages().subscribe((messages:any) => {
      console.log(messages)
      this.allMessages = messages.messages
    })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialog, {
      width: '300px',
      data: {message: this.message},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.message = result;
      if (this.accService.isLoggedIn()) {
        this.messageService.postMessage(this.accService.getUsername(), this.message).subscribe((res:any) => {
          this.allMessages.push(res.post)
        })
      }
      
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
