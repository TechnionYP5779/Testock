import {Component, Input, OnInit} from '@angular/core';
import {CommentId, CommentWithCreatorId} from '../../core/entities/comment';
import {TopicId} from '../../core/entities/topic';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';

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
  topic: TopicId;

  constructor(private db: DbService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  markAsAnswer() {
    this.db.markAsAnswer(this.topic, this.comment).then(() => {
      this.snackBar.open(`Marked as answer successfully!`, 'close', {duration: 3000});
    });
  }

  unmarkAsAnswer() {
    this.db.clearMarkAsAnswer(this.topic).then(() => {
      this.snackBar.open(`Unmarked as answer successfully!`, 'close', {duration: 3000});
    });
  }
}
