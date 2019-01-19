import {Component, Input, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../core/auth.service';
import {Comment} from '../../core/entities/comment';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

  @Input()
  topicId: string;

  subjectValue: string;
  contentValue: string;

  constructor(private auth: AuthService, private db: DbService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  addComment() {
    const comment = {} as Comment;
    comment.creator = this.auth.currentUserId;
    comment.subject = this.subjectValue;
    comment.text = this.contentValue;
    this.db.addComment(this.topicId, comment).then(() => {
      this.snackBar.open(`Comment created successfully!`, 'close', {duration: 3000});
      this.subjectValue = null;
      this.contentValue = null;
    });
  }
}
