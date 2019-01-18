import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {TopicId, TopicWithCreatorId} from '../../core/entities/topic';
import {Observable} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {CommentWithCreatorId} from '../../core/entities/comment';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  private readonly id: string;
  public topic$: Observable<TopicWithCreatorId>;
  public comments$: Observable<CommentWithCreatorId[]>;

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.topic$ = this.db.getTopic(this.id);
    this.comments$ = this.db.getTopic(this.id).pipe(switchMap(topic => this.db.getCommentsForTopic(topic.id)));
  }

  ngOnInit() {
  }
}
