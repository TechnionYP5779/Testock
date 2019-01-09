import { Component, OnInit } from '@angular/core';
import {Roles, UserData} from '../../core/entities/user';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';
import {FacultyId} from '../../core/entities/faculty';
import {Course} from '../../core/entities/course';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: UserData[];
  faculties: FacultyId[];
  newCourse: Course = {id: null, faculty: null, name: null};

  constructor(private db: DbService, private snackBar: MatSnackBar) {
    this.db.getAllUsers().subscribe(users => this.users = users);
    this.db.getFaculties().subscribe(facs => this.faculties = facs);
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

  createNewCourse() {
    this.db.createCourse(this.newCourse)
      .then(() => {
        this.snackBar.open(`Course ${this.newCourse.name} (${this.newCourse.id}) created successfully!`, 'close', {duration: 3000});
      });
  }
}
