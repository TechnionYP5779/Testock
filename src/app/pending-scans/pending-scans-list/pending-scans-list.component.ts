import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PendingScanId} from '../../entities/pending-scan';
import {DbService} from '../../core/db.service';

@Component({
  selector: 'app-pending-scans-list',
  templateUrl: './pending-scans-list.component.html',
  styleUrls: ['./pending-scans-list.component.scss']
})
export class PendingScansListComponent implements OnInit {

  private _course: number;
  private _year: number;
  private _semester: string;
  private _moed: string;

  pendingScans$: Observable<PendingScanId[]>;

  @Input() set course(courseId: number) {
    this._course = courseId;
    this.updatePendingScans();
  }

  @Input() set year(year: number) {
    this._year = year;
    this.updatePendingScans();
  }

  @Input() set semester(sem: string) {
    this._semester = sem;
    this.updatePendingScans();
  }

  @Input() set moed(moed: string) {
    this._moed = moed;
    this.updatePendingScans();
  }

  private updatePendingScans() {
    this.pendingScans$ = this.db.getPendingScans(this._course, this._year, this._semester, this._moed);
  }

  constructor(private db: DbService) { }

  ngOnInit() {
  }

}
