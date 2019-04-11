import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Observable} from 'rxjs';
import {UserData} from '../../core/entities/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MsGraphService} from '../../core/msgraph.service';
import {MsalService} from '@azure/msal-angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  private profilePic: Promise<Blob>;

  constructor(public auth: AuthService, private msgraph: MsGraphService) { }

  user$: Observable<UserData>;

  ngOnInit() {
    this.user$ = this.auth.user$;
    this.profilePic = this.msgraph.profilePictureAsBlob;
  }

  logout() {
    this.auth.signOut();
  }
}
