import { Component, OnInit } from '@angular/core';
import {Roles, UserData} from '../../core/entities/user';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: UserData[];

  constructor(private db: DbService, private snackBar: MatSnackBar) {
    this.db.getAllUsers().subscribe(users => this.users = users);
  }

  ngOnInit() {
  }

  userPermissionChanged(user: UserData, $event: any) {
    $event.target.disabled = true;
    const roles: Roles = {user: $event.target.checked};
    this.db.setUserRoles(user.uid, roles).then(() => {
      this.snackBar.open(`Permissions for ${user.name} set successfully!`, 'close', {duration: 3000});
    });
  }

  adminPermissionChanged(user: UserData, $event: any) {
    const roles = {admin: $event.target.checked};
    this.db.setUserRoles(user.uid, roles).then(() => {
      this.snackBar.open(`Permissions for ${user.name} set successfully!`, 'close', {duration: 3000});
    });
  }
}
