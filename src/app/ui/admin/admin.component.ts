import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {UserData} from '../../core/entities/user';
import {DbService} from '../../core/db.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: UserData[];

  constructor(private db: DbService) {
    this.db.getAllUsers().subscribe(users => this.users = users);
  }

  ngOnInit() {
  }

}
