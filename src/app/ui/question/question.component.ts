import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question} from '../../core/entities/question';
import {Solution} from '../../core/entities/solution';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  private id: string;
  public question: Question;
  public solutions: Solution[];

  constructor(private route: ActivatedRoute, private db: DbService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getQuestion();
    this.getSolutions();
  }

  getQuestion(): void {
    this.db.getQuestion(this.id).subscribe(q => this.question = q);

  }

  getSolutions(): void {
    this.db.getSolutions(this.id).subscribe(sol => this.solutions = sol);
  }

}
