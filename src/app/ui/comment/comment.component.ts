import {Component, Input, OnInit} from '@angular/core';
import {CommentId, CommentWithCreatorId} from '../../core/entities/comment';
import {TopicId, TopicWithCreatorId} from '../../core/entities/topic';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../core/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input()
  comment: CommentWithCreatorId;

  @Input()
  isSolution = false;

  @Input()
  allowToMarkAsSolution: boolean;

  @Input()
  topic: TopicWithCreatorId;

  canMark: boolean;
  isAdmin: boolean;

  constructor(private db: DbService, private snackBar: MatSnackBar, private auth: AuthService) { }

  ngOnInit() {
    this.auth.isAdminForCourse(this.topic.linkedCourseId).subscribe(is => this.isAdmin = is);
    this.canMark = this.auth.currentUserId === this.topic.creator.uid || this.isAdmin;
  }

  markAsAnswer() {
    this.db.markAsAnswer(this.topic.id, this.comment.id).then(() => {
      this.snackBar.open(`Marked as answer successfully!`, 'close', {duration: 3000});
    });
  }

  unmarkAsAnswer() {
    this.db.clearMarkAsAnswer(this.topic.id).then(() => {
      this.snackBar.open(`Unmarked as answer successfully!`, 'close', {duration: 3000});
    });
  }
}
