import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../../core/entities/topic';
import {DbService} from '../../core/db.service';
import {TopicId} from '../../core/entities/topic';
import {Comment} from '../../core/entities/comment';
import {CommentId} from '../../core/entities/comment';
import {AuthService} from '../../core/auth.service';

// Todo: temp class need to remove after db works:
export class MyTopic implements Topic {
  subject = 'my temp subject';
  text = 'content';
  creator = 'max calderon';
  created = new Date();
}

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  // Todo: this comment is the code needed after the DB works:
  // public topic: Topic;
  // Todo: temp class need to remove after DB works
  public topic: MyTopic;
  public id: number;
  public creatorName: string;

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getTopic();
    this.getCreator();
  }

  getTopic(): void {
    // Todo: this comment is the code needed after the DB works:
    // this.db.getTopic(this.id).subscribe(topic => this.topic = topic);
    // Todo: temp need to remove after DB works:
    this.topic = new MyTopic();
  }

  getCreator(): void {
    // Todo: this comment is the code needed after the DB works:
    // this.db.getUser(this.topic.creator).subscribe(user => this.creatorName = user.uid);
    // Todo: temp need to remove after DB works:
    this.creatorName = 'max calderon';
  }
}
