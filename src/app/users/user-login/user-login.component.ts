import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.state.subscribe((res) => {
      if (res) {
        this.router.navigateByUrl('/');
      }
    });
  }

  signInWithTechnion() {
    this.auth.loginWithCampus();
  }
}

