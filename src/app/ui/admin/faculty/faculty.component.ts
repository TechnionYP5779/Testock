import {Component, Input, OnInit} from '@angular/core';
import {FacultyId} from '../../../core/entities/faculty';
import {DbService} from '../../../core/db.service';
import {UserData} from '../../../core/entities/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  _faculty: FacultyId;

  admins: UserData[];
  private subscription: Subscription;

  constructor(private db: DbService) { }

  ngOnInit() {
  }

  @Input() set faculty(value: FacultyId) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this._faculty = value;
    this.subscription = this.db.getAdminsOfFaculty(value).subscribe(admins => this.admins = admins);
  }
}
