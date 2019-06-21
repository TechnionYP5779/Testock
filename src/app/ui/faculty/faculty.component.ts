import {Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {ActivatedRoute} from '@angular/router';
import {FacultyId} from '../../entities/faculty';
import {Observable} from 'rxjs';
import {AuthService} from '../../users/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material';
import {UserData} from '../../entities/user';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacultyComponent implements OnInit {

  public faculty$: Observable<FacultyId>;
  public courses$: Observable<Course[]>;
  facultyAdmins$: Observable<UserData[]>;
  isAdmin$: Observable<boolean>;
  public id: Observable<string>;

  newCourse: Course;

  constructor(private route: ActivatedRoute, private db: DbService, private snackBar: MatSnackBar,
              private auth: AuthService, private modal: NgbModal, private spinner: NgxSpinnerService) {
    this.id = this.route.params.pipe(map(params => params.id));
    this.faculty$ = this.id.pipe(switchMap(id => this.db.getFaculty(id)));
    this.courses$ = this.id.pipe(switchMap(id => this.db.getCoursesOfFaculty(id)));
    this.isAdmin$ = this.id.pipe(switchMap(id => this.auth.isAdminOfFaculty(id)));
    this.facultyAdmins$ = this.id.pipe(switchMap(id => this.db.getAdminsOfFaculty(id)));
  }

  ngOnInit() {
  }

  async openCreateCourseModal(createCourseModal: TemplateRef<any>, facultyId: string) {
    this.newCourse = {
      faculty: facultyId,
      id: null,
      name: null,
      tags: [],
      created: null,
      description: null
    };
    const result = await this.modal.open(createCourseModal).result.catch(reason => {});
    if (result) {

      if (!this.newCourse.name) {
        this.snackBar.open('Error: Please enter course name', 'close', {duration: 3000});
        return;
      }

      if (!this.newCourse.id) {
        this.snackBar.open('Error: Please enter course number', 'close', {duration: 3000});
        return;
      }

      if (this.newCourse.id < 100000 || this.newCourse.id > 999999) {
        this.snackBar.open('Error: Invalid course number', 'close', {duration: 3000});
        return;
      }

      await this.spinner.show();
      this.newCourse.description = 'Welcome to the "' +  this.newCourse.name + '"('  + this.newCourse.id +
        ') course page. Good luck in your exams!';
      await this.db.createCourse(this.newCourse).then();
      await this.spinner.hide();
      this.snackBar.open('Course created successfully', 'close', {duration: 3000});
    }
  }
}
