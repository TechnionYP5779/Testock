import {Component, Input, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {AuthService} from '../../core/auth.service';
import {Topic} from '../../core/entities/topic';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

  public subjectValue: string;
  public contentValue: string;

  @Input()
  linkedCourseId: number = null;

  @Input()
  linkedQuestionId: string = null;

  constructor(private auth: AuthService, private db: DbService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  createTopic() {
    const topic = {} as Topic;
    topic.creator = this.auth.currentUserId;
    topic.subject = this.subjectValue;
    topic.text = this.contentValue;
    if (this.linkedCourseId) {
      topic.linkedCourseId = this.linkedCourseId;
    }
    if (this.linkedQuestionId) {
      topic.linkedQuestionId = this.linkedQuestionId;
    }
    this.db.createTopic(topic).then(() => {
      this.snackBar.open(`Topic created successfully!`, 'close', {duration: 3000});
    });
    this.subjectValue = null;
    this.contentValue = null;
  }
}
