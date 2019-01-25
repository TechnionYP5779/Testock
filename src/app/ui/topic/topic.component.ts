import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {TopicId, TopicWithCreatorId} from '../../core/entities/topic';
import {Observable, of} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {CommentWithCreatorId} from '../../core/entities/comment';
import {Course} from '../../core/entities/course';
import {QuestionId} from '../../core/entities/question';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  private readonly id: string;
  public topic$: Observable<TopicWithCreatorId>;
  public comments$: Observable<CommentWithCreatorId[]>;
  public linkedCourse$: Observable<Course>;
  public linkedQuestion$: Observable<QuestionId>;
  public linkedQuestionCourse$: Observable<Course>;
  public adminAccess$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.topic$ = this.db.getTopic(this.id);
    this.comments$ = this.db.getCommentsForTopic(this.id);

    this.adminAccess$ = this.db.getTopic(this.id).pipe(flatMap(topic => {
      if (topic.linkedCourseId) {
        return this.auth.isAdminForCourse(topic.linkedCourseId);
      } else if (topic.linkedQuestionId) {
        return this.auth.isAdminForQuestion(topic.linkedQuestionId);
      } else {
        return of(null);
      }
    }));

    this.linkedCourse$ = this.db.getTopic(this.id).pipe(flatMap(topic => {
      if (topic.linkedCourseId) {
        return this.db.getCourse(topic.linkedCourseId);
      } else {
        return of(null);
      }
    }));
    this.linkedQuestion$ = this.db.getTopic(this.id).pipe(flatMap(topic => {
      if (topic.linkedQuestionId) {
        return this.db.getQuestion(topic.linkedQuestionId);
      } else {
        return of(null);
      }
    }));
    this.linkedQuestionCourse$ = this.db.getTopic(this.id).pipe(flatMap(topic => {
      if (topic.linkedQuestionId) {
        return this.db.getQuestion(topic.linkedQuestionId);
      } else {
        return of(null);
      }
    })).pipe(flatMap(question => {
      if (question) {
        return this.db.getCourse(question.course);
      } else {
        return of(null);
      }
    }));
  }

  ngOnInit() {
  }
}
