import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {UserLoginComponent} from './users/user-login/user-login.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {UploadComponent} from './ui/upload/upload.component';

const routes: Routes = [
  {path: '', component: CoursesComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'profile', component: UserProfileComponent},
  {path: 'courses', component: CoursesComponent},
  {path: 'course/:id', component: CourseComponent},
  {path: 'question/:id', component: QuestionComponent},
  {path: 'course/:cid/exam/:eid', component: ExamComponent},
  {path: 'upload', component: UploadComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
