import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionId} from '../../entities/question';
import {SolutionId} from '../../entities/solution';
import {DbService} from '../../core/db.service';
import {PendingScanId} from '../../entities/pending-scan';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-pending-solution-modal',
  templateUrl: './pending-solution-modal.component.html',
  styleUrls: ['./pending-solution-modal.component.scss']
})
export class PendingSolutionModalComponent implements OnInit {

  @Input() question: QuestionId;
  @Input() solution: SolutionId;

  public pendingScan$: Observable<PendingScanId>;

  constructor(public activeModal: NgbActiveModal, private db: DbService) {
  }

  ngOnInit() {
    this.pendingScan$ = this.db.getPendingScan(this.solution.pendingScanId);
  }

}
