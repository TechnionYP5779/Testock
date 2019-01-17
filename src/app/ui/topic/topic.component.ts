import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../../core/entities/topic';
import {DbService} from '../../core/db.service';
import {TopicId} from '../../core/entities/topic';
import {Comment} from '../../core/entities/comment';
import {CommentId} from '../../core/entities/comment';
import {AuthService} from '../../core/auth.service';

//temp class need to remove after db works:
class MyTopic implements Topic {
  subject = 'my temp subject';
  text = 'content';
  creator = 'max calderon';
  time = new Date();
}

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  // public topic: Topic;
  public topic: MyTopic;
  public id: number;
  public answers: CommentId[];

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getTopic();
  }

  getTopic(): void {
    // this.db.getTopic(this.id).subscribe(topic => this.topic = topic);
    // temp:
    this.topic = new MyTopic();
  }
}
