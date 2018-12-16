import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {UserLoginComponent} from './users/user-login/user-login.component';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {CoursesComponent} from './ui/courses/courses.component';
import {CourseComponent} from './ui/course/course.component';

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full'},
  { path: 'login', component: UserLoginComponent},
  { path: 'profile', component: UserProfileComponent},
  { path: 'courses', component: CoursesComponent},
  { path: 'course/:id', component: CourseComponent }
];

@NgModule({
  exports: [ RouterModule],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule { }
