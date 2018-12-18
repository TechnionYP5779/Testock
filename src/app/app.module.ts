import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

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
import {MainNavigationComponent} from './ui/main-navigation/main-navigation.component';
import {HeaderComponent} from './ui/header/header.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule} from '@angular/material';
import { NavComponent } from './ui/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UserProfilePicComponent } from './ui/user-profile-pic/user-profile-pic.component';
import { BreadcrumbsComponent } from './ui/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserProfileComponent,
    HeaderComponent,
    MainNavigationComponent,
    NavComponent,
    UserProfilePicComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  providers: [AuthService, PdfService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
