import {Component, Input, OnInit} from '@angular/core';
import {CommentId, CommentWithCreatorId} from '../../core/entities/comment';

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

  constructor() { }

  ngOnInit() {
  }

}
