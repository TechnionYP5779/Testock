import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AppRoutingModule} from './app-routing.module';

import {AuthService} from './core/auth.service';
import {UserLoginComponent} from './users/user-login/user-login.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {PdfService} from './core/pdf.service';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {HeaderComponent} from './ui/header/header.component';
import {BreadcrumbsComponent} from './ui/breadcrumbs/breadcrumbs.component';
import {UploadComponent} from './ui/upload/upload.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {ScanPageComponent} from './ui/upload/scan-page/scan-page.component';
import {UploadQuestionComponent} from './ui/upload/upload-question/upload-question.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {CoreModule} from './core/core.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './ui/home/home.component';
import { FacebookProfilePictureComponent } from './users/facebook-profile-picture/facebook-profile-picture.component';
import { SolutionComponent } from './ui/solution/solution.component';
import { AdminComponent } from './ui/admin/admin.component';
import { FacultyControlPanelComponent } from './ui/admin/faculty-control-panel/faculty-control-panel.component';
import { TopicComponent } from './ui/topic/topic.component';
import { CommentComponent } from './ui/comment/comment.component';
import { CreateTopicComponent } from './ui/create-topic/create-topic.component';
import {CKEditorModule} from 'ngx-ckeditor';
import { CreateCommentComponent } from './ui/create-comment/create-comment.component';
import { FacultiesComponent } from './ui/faculties/faculties.component';
import { FacultyComponent } from './ui/faculty/faculty.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserProfileComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    CoursesComponent,
    CourseComponent,
    QuestionComponent,
    ExamComponent,
    UploadComponent,
    HomeComponent,
    FacebookProfilePictureComponent,
    ScanPageComponent,
    UploadQuestionComponent,
    SolutionComponent,
    AdminComponent,
    FacultyControlPanelComponent,
    TopicComponent,
    CommentComponent,
    CreateTopicComponent,
    CreateCommentComponent,
    FacultiesComponent,
    FacultyComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCheckboxModule,
    ImageCropperModule,
    CoreModule,
    MatSnackBarModule,
    FormsModule,
    CKEditorModule,
    HttpClientModule
  ],
  providers: [AuthService, PdfService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
