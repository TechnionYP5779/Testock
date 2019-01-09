import {Component, OnInit} from '@angular/core';
import {Roles, UserData} from '../../core/entities/user';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';
import {Faculty, FacultyId} from '../../core/entities/faculty';
import {Course} from '../../core/entities/course';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: UserData[];
  faculties: FacultyId[];
  newCourse: Course = {id: null, faculty: null, name: null};
  newFaculty: Faculty = {name: null};
  selectedUser: UserData = null;
  // selectedUserRoles: Roles;
  // private userRolesSubscription: Subscription;

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
        this.newCourse = {id: null, name: null, faculty: null};
      });
  }

  createNewFaculty() {
    this.db.createFaculty(this.newFaculty).then(() => {
      this.snackBar.open(`Faculty ${this.newFaculty.name} created successfully!`, 'close', {duration: 3000});
      this.newFaculty = {name: null};
    });
  }

  // userSelectionChanged() {
  //   if (this.userRolesSubscription) {
  //     this.userRolesSubscription.unsubscribe();
  //   }
  //   this.userRolesSubscription = this.db.getUserRoles(this.selectedUser.uid).subscribe(roles => this.selectedUserRoles = roles);
  // }

  setUserPermissions() {
    this.db.setUserRoles(this.selectedUser.uid, this.selectedUser.roles).then(() => {
      this.snackBar.open(`Permissions for ${this.selectedUser.name} set successfully!`, 'close', {duration: 3000});
    });
  }

  changedFacultyPermission(event: any, id: string) {
    if (event.target.checked) {
      this.selectedUser.roles.faculty_admin.push(id);
    } else {
      this.selectedUser.roles.faculty_admin.splice(this.selectedUser.roles.faculty_admin.indexOf(id), 1);
    }
  }
}
