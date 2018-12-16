import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-user-profile-pic',
  templateUrl: './user-profile-pic.component.html',
  styleUrls: ['./user-profile-pic.component.scss']
})
export class UserProfilePicComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
