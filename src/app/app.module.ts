import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';

import {AuthService} from './users/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import {PdfService} from './upload/pdf.service';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {HeaderComponent} from './ui/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatBottomSheetModule, MatListModule, MatPaginatorModule, MatTableModule} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
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
import { MatSortModule } from '@angular/material/sort';
import {PendingScansModule} from './pending-scans/pending-scans.module';
import {NgbModule, NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {PendingSolutionModalComponent} from './pending-scans/pending-solution-modal/pending-solution-modal.component';
import { TagComponent } from './ui/tag/tag.component';
import {CKEditorModule} from 'ngx-ckeditor';
import {PendingScanModalComponent} from './pending-scans/pending-scan-modal/pending-scan-modal.component';
import {ScanEditorPreviewComponent} from './upload/scan-editor/scan-editor-preview/scan-editor-preview.component';
import {ExamsListComponent} from './ui/exams-list/exams-list.component';
import { ChooseQuestionTagComponent } from './ui/to-bottom-sheet/choose-question-tag/choose-question-tag.component';
import { AboutComponent } from './ui/about/about.component';
import {ScanDetailsPickerComponent} from './upload/scan-details-picker/scan-details-picker.component';
import { FacultyAdminsListComponent } from './ui/faculty/faculty-admins-list/faculty-admins-list.component';


@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    FontAwesomeModule,
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
    PendingScansModule,
    NgbModule,
    NgbModalModule,
    CommonModule,
    CKEditorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgbRatingModule,
    MatTableModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatListModule
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
    FacultyComponent,
    TagComponent,
    ExamsListComponent,
    ChooseQuestionTagComponent,
    AboutComponent,
    FacultyAdminsListComponent
  ],
  providers: [AuthService, PdfService, MsGraphService],
  bootstrap: [AppComponent],
  entryComponents: [
    PendingSolutionModalComponent,
    PendingScanModalComponent,
    ScanEditorPreviewComponent,
    ChooseQuestionTagComponent,
    ScanDetailsPickerComponent
  ]
})
export class AppModule {
  constructor() {
    library.add(fas, far, faFacebookSquare);
  }
}
