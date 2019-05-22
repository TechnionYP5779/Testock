import {Component, Input, OnInit} from '@angular/core';
import {SolutionId} from '../../entities/solution';
import {QuestionId} from '../../entities/question';
import {DbService} from '../../core/db.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
    this.db.updateSolutionGrade(this.solution, this.question).then(() => {
      this.snackBar.open(`Solution Updated Successfully`, 'close', {duration: 3000});
    });
  }

  solThumbClick(content) {
    if (this.solution.pendingScanId) {
      this.router.navigateByUrl(`/pendingScan/${this.solution.pendingScanId}`);
    } else {
      this.modalService.open(content, {size: 'lg'}).result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log('Dismissed');
      });
    }
  }
}
