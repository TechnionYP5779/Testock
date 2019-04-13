import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AdminOnlyGuard} from './guards/admin-only.guard';
import {UsersOnlyGuard} from './guards/users-only.guard';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFontAwesomeModule} from 'angular-font-awesome';

@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  providers: [
    AdminOnlyGuard,
    UsersOnlyGuard
  ],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFontAwesomeModule
  ],
  exports: [
    UserProfileComponent
  ]
})
export class UsersModule { }
