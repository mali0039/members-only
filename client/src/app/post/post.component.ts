import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { MessageService } from '../services/message.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input('username') username!: string
  @Input('message') message!: string
  @Input('date') date !: string
  @Input('id') id !: string
  @Output() deleteEvent = new EventEmitter<string>();

  constructor(public accService: AccountService, private messageService: MessageService) { }

  ngOnInit(): void {
  }
  deletePost() {
    this.messageService.deleteMessage(this.id).subscribe((res:any) => {
      if (res['success'] == true) {
        this.deleteEvent.emit(this.id);

      }
     
    })
  }
}
