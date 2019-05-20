import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';

import {AuthService} from './users/auth.service';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {PdfService} from './upload/pdf.service';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {HeaderComponent} from './ui/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CoreModule} from './core/core.module';
import {FormsModule} from '@angular/forms';
import {FacultiesComponent} from './ui/faculties/faculties.component';
import {FacultyComponent} from './ui/faculty/faculty.component';
import {MsGraphService} from './users/msgraph.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SolutionComponent} from './ui/solution/solution.component';
import {UsersModule} from './users/users.module';
import {UploadModule} from './upload/upload.module';
import {AdminModule} from './admin/admin.module';
import {DiscussionsModule} from './discussions/discussions.module';
import {GamificationModule} from './gamification/gamification.module';
import {MatSortModule} from '@angular/material';
import {PendingScansModule} from './pending-scans/pending-scans.module';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    AngularFontAwesomeModule,
    CoreModule,
    AdminModule,
    DiscussionsModule,
    UploadModule,
    UsersModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    GamificationModule,
    MatSortModule,
    PendingScansModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    CoursesComponent,
    CourseComponent,
    QuestionComponent,
    ExamComponent,
    SolutionComponent,
    FacultiesComponent,
    FacultyComponent
  ],
  providers: [AuthService, PdfService, MsGraphService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
