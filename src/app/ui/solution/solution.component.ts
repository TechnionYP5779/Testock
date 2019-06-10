import {Component, Input, OnInit} from '@angular/core';
import {SolutionId} from '../../entities/solution';
import {QuestionId} from '../../entities/question';
import {DbService} from '../../core/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PendingSolutionModalComponent} from '../../pending-scans/pending-solution-modal/pending-solution-modal.component';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input() solution: SolutionId;
  @Input() question: QuestionId;

  @Input()
  adminAccess: boolean;

  constructor(private db: DbService, private snackBar: MatSnackBar, private router: Router, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  deleteSolution(sol: SolutionId): void {
    this.db.deleteSolution(sol, this.question).then(() => {
      this.snackBar.open(`Solution Deleted Successfully`, 'close', {duration: 3000});
    });
  }

  saveSolution() {
    const p1 = this.db.updateSolutionGrade(this.solution, this.question);
    const p2 = this.db.updateQuestionTotalGrade(this.question);
    Promise.all([p1, p2]).then(() => {
      this.snackBar.open(`Solution Updated Successfully`, 'close', {duration: 3000});
    });
  }

  solThumbClick(content) {
    if (this.solution.pendingScanId) {
      const modalRef = this.modalService.open(PendingSolutionModalComponent, {size: 'lg'});
      modalRef.componentInstance.question = this.question;
      modalRef.componentInstance.solution = this.solution;
    } else {
      this.modalService.open(content, {size: 'lg'});
    }
  }
}
