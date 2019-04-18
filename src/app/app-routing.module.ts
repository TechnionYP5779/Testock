import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {UploadComponent} from './upload/upload/upload.component';
import {UsersOnlyGuard} from './users/guards/users-only.guard';
import {AdminComponent} from './admin/admin/admin.component';
import {AdminOnlyGuard} from './users/guards/admin-only.guard';
import {TopicComponent} from './discussions/topic/topic.component';
import {FacultiesComponent} from './ui/faculties/faculties.component';
import {FacultyComponent} from './ui/faculty/faculty.component';

const routes: Routes = [
  {path: '', component: FacultiesComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [UsersOnlyGuard]},
  {path: 'profile/:uid', component: UserProfileComponent, canActivate: [UsersOnlyGuard]},
  {path: 'courses', component: CoursesComponent, canActivate: [UsersOnlyGuard]},
  {path: 'course/:id', component: CourseComponent, canActivate: [UsersOnlyGuard]},
  {path: 'question/:id', component: QuestionComponent, canActivate: [UsersOnlyGuard]},
  {path: 'course/:cid/exam/:eid', component: ExamComponent, canActivate: [UsersOnlyGuard]},
  {path: 'upload', component: UploadComponent, canActivate: [UsersOnlyGuard]},
  {path: 'upload/:source', component: UploadComponent, canActivate: [UsersOnlyGuard]},
  {path: 'courses/:term', component: CoursesComponent, canActivate: [UsersOnlyGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AdminOnlyGuard]},
  {path: 'topic/:id', component: TopicComponent, canActivate: [UsersOnlyGuard]},
  {path: 'faculties', component: FacultiesComponent, canActivate: [UsersOnlyGuard]},
  {path: 'faculty/:id', component: FacultyComponent, canActivate: [UsersOnlyGuard]}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
