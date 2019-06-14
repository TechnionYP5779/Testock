import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FacultyId} from '../../entities/faculty';
import {UserData} from '../../entities/user';
import {DbService} from '../../core/db.service';

@Component({
  selector: 'app-faculty-control-panel',
  templateUrl: './faculty-control-panel.component.html',
  styleUrls: ['./faculty-control-panel.component.scss']
})
export class FacultyControlPanelComponent implements OnInit {

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
    this.subscription = this.db.getAdminsOfFaculty(value.id).subscribe(admins => this.admins = admins);
  }
}
