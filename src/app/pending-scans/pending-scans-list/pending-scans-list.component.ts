import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PendingScanId} from '../../entities/pending-scan';
import {DbService} from '../../core/db.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Moed} from '../../entities/moed';

@Component({
  selector: 'app-pending-scans-list',
  templateUrl: './pending-scans-list.component.html',
  styleUrls: ['./pending-scans-list.component.scss']
})
export class PendingScansListComponent implements OnInit {

  private _course: number;
  private _moed: Moed;
  @Input() adminAccess: boolean;

  pendingScans$: Observable<PendingScanId[]>;

  @Input() set course(courseId: number) {
    this._course = courseId;
    this.updatePendingScans();
  }


  @Input() set moed(moed: Moed) {
    this._moed = moed;
    this.updatePendingScans();
  }

  private updatePendingScans() {
    this.pendingScans$ = this.db.getPendingScans(this._course, this._moed);
  }

  constructor(private db: DbService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  removePendingScan($event: MouseEvent, p: PendingScanId) {
    $event.preventDefault();
    $event.stopPropagation();
    this.spinner.show();
    this.db.deletePendingScan(p.id).then(() => this.spinner.hide());
  }
}
