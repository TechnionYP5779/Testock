import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {CommentWithCreatorId} from '../../entities/comment';
import {TopicWithCreatorId} from '../../entities/topic';
import {DbService} from '../../core/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';

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

  @Input()
  isAdmin: boolean;

  constructor(private db: DbService, private snackBar: MatSnackBar, private modal: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit() {
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

  async deleteComment(confirmDeleteComment: TemplateRef<any>) {
    const result = await this.modal.open(confirmDeleteComment).result.catch(reason => {});

    if (result) {
      await this.spinner.show();
      await this.db.deleteCommentOfTopic(this.topic.id, this.comment.id);
      await this.spinner.hide();
      this.snackBar.open('Comment deleted successfully', 'close', {duration: 3000});
    }
  }
}
