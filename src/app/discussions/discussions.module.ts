import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentComponent} from './comment/comment.component';
import {CreateCommentComponent} from './create-comment/create-comment.component';
import {CreateTopicComponent} from './create-topic/create-topic.component';
import {TopicComponent} from './topic/topic.component';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/users.module';
import {CKEditorModule} from 'ngx-ckeditor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AppRoutingModule} from '../app-routing.module';

@NgModule({
  declarations: [CommentComponent,
    CreateCommentComponent,
    TopicComponent,
    CreateTopicComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    UsersModule,
    CKEditorModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  exports: [
    TopicComponent,
    CreateTopicComponent
  ]
})
export class DiscussionsModule { }
