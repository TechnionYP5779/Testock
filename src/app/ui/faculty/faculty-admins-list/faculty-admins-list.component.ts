import {Component, Input, OnInit} from '@angular/core';
import {Faculty, FacultyId} from '../../../entities/faculty';
import {Observable} from 'rxjs';
import {UserData} from '../../../entities/user';
import {DbService} from '../../../core/db.service';

@Component({
  selector: 'app-faculty-admins-list',
  templateUrl: './faculty-admins-list.component.html',
  styleUrls: ['./faculty-admins-list.component.scss']
})
export class FacultyAdminsListComponent implements OnInit {

  facultyAdmins$: Observable<UserData[]>;

  @Input() set faculty(fac: FacultyId) {
    this.facultyAdmins$ = this.db.getAdminsOfFaculty(fac);
  }

  constructor(private db: DbService) { }

  ngOnInit() {
  }

}
