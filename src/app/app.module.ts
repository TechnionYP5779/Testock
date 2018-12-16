import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './core/auth.service';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { LogoComponent } from './logo/logo.component';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {PdfService} from './pdf.service';
import { CoursesComponent } from './ui/courses/courses.component';
import { CourseComponent } from './ui/course/course.component';
import { QuestionComponent } from './ui/question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserProfileComponent,
    LogoComponent,
    CoursesComponent,
    CourseComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [AuthService, PdfService],
  bootstrap: [AppComponent]
})
export class AppModule { }
