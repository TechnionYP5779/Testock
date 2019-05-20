import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Observable} from 'rxjs';
import {PendingScanId} from '../../entities/pending-scan';
import {Course} from '../../entities/course';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-pending-scan-view',
  templateUrl: './pending-scan.component.html',
  styleUrls: ['./pending-scan.component.scss']
})
export class PendingScanComponent implements OnInit {

  pendingScanId: string;
  pendingScan$: Observable<PendingScanId>;
  course$: Observable<Course>;

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.pendingScanId = this.route.snapshot.paramMap.get('id');
    this.pendingScan$ = this.db.getPendingScan(this.pendingScanId);
    this.course$ = this.db.getPendingScan(this.pendingScanId).pipe(flatMap(ps => this.db.getCourse(ps.course)));
  }

  ngOnInit() {
  }

}
