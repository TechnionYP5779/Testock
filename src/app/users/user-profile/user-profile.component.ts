import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Observable} from 'rxjs';
import {UserData} from '../../core/entities/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService) { }

  user$: Observable<UserData>;

  ngOnInit() {
    this.user$ = this.auth.user$;
  }

  logout() {
    this.auth.signOut();
  }
}
