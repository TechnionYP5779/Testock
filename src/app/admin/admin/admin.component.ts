import {Component, OnInit} from '@angular/core';
import {UserData} from '../../entities/user';
import {DbService} from '../../core/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Faculty, FacultyId} from '../../entities/faculty';
import {Course} from '../../entities/course';
import {NgxSpinnerService} from 'ngx-spinner';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: UserData[];
  faculties: FacultyId[];
  newCourse: Course = {id: null, faculty: null, description: null, name: null, created: null, tags: null};
  newFaculty: Faculty = {name: null, created: null};
  selectedUser: UserData = null;

  constructor(private db: DbService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService) {
    this.db.getAllUsers().subscribe(users => this.users = users);
    this.db.getFaculties().subscribe(facs => this.faculties = facs);
  }

  ngOnInit() {
  }

  createNewCourse() {
    this.spinner.show();
    this.newCourse.description = 'Welcome to the "' +  this.newCourse.name + '"('  + this.newCourse.id +
      ') course page. Good luck in your exams!';
    this.db.createCourse(this.newCourse).then(() => this.spinner.hide())
      .then(() => {
        this.snackBar.open(`Course ${this.newCourse.name} (${this.newCourse.id}) created successfully!`, 'close', {duration: 3000});
        this.newCourse = {id: null, name: null, faculty: null, description: null, created: null, tags: null};
      });
  }

  createNewFaculty() {
    this.spinner.show();
    this.newFaculty.created = Timestamp.now();
    this.db.createFaculty(this.newFaculty).then(() => this.spinner.hide()).then(() => {
      this.snackBar.open(`Faculty ${this.newFaculty.name} created successfully!`, 'close', {duration: 3000});
      this.newFaculty = {name: null, created: null};
    });
  }

  setUserPermissions() {
    this.spinner.show();
    this.db.setUserRoles(this.selectedUser.uid, this.selectedUser.roles).then(() => this.spinner.hide()).then(() => {
      this.snackBar.open(`Permissions for ${this.selectedUser.name} set successfully!`, 'close', {duration: 3000});
    });
  }

  changedFacultyPermission(event: any, id: string) {
    if (event.target.checked) {
      if (this.selectedUser.roles.faculty_admin) {
        this.selectedUser.roles.faculty_admin.push(id);
      } else {
        this.selectedUser.roles.faculty_admin = [id];
      }
    } else {
      this.selectedUser.roles.faculty_admin.splice(this.selectedUser.roles.faculty_admin.indexOf(id), 1);
    }
  }
}
