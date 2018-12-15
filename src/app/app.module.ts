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
import {MatButtonToggleModule, MatCheckboxModule, MatSidenavModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserProfileComponent,
    HeaderComponent,
    MainNavigationComponent
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
    MatButtonToggleModule
  ],
  providers: [AuthService, PdfService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
