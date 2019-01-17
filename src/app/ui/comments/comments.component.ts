import { Component, Input, OnInit } from '@angular/core';
import { MyTopic } from './../topic/topic.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() topic: MyTopic;

  constructor() { }

  ngOnInit() {
  }

}
