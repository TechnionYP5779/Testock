import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserLoginComponent} from './users/user-login/user-login.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';
import {QuestionComponent} from './ui/question/question.component';
import {ExamComponent} from './ui/exam/exam.component';
import {UploadComponent} from './ui/upload/upload.component';
import {UsersOnlyGuard} from './core/users-only.guard';
import {AdminComponent} from './ui/admin/admin.component';
import {AdminOnlyGuard} from './core/admin-only.guard';
import {TopicComponent} from './ui/topic/topic.component';
import {FacultiesComponent} from './ui/faculties/faculties.component';
import {FacultyComponent} from './ui/faculty/faculty.component';
import {ShopComponent} from './ui/shop/shop.component';

const routes: Routes = [
  {path: '', component: FacultiesComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'profile', component: UserProfileComponent, canActivate: [UsersOnlyGuard]},
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
  {path: 'faculty/:id', component: FacultyComponent, canActivate: [UsersOnlyGuard]},
  {path: 'shop', component: ShopComponent, canActivate: [UsersOnlyGuard]}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
