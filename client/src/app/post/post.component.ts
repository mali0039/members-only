import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input('username') username!: string
  @Input('message') message!: string
  constructor() { }

  ngOnInit(): void {
  }

}
