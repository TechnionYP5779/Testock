import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExamId} from '../../entities/exam';
import {SemesterPipe} from '../../core/semester.pipe';
import {MoedPipe} from '../../core/moed.pipe';
import {MatPaginator, MatTableDataSource, Sort} from '@angular/material';
import {YearPipe} from '../../core/year.pipe';
import {QuestionId} from '../../entities/question';
import {Observable} from 'rxjs';
import {DbService} from '../../core/db.service';

export interface ExamRow {
  id: string;
  course: number;
  year: number;
  semester: string;
  moed: string;
  questions: Observable<QuestionId[]>;
}

@Component({
  selector: 'app-exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ExamsListComponent implements OnInit {
  @Input() set exams(exams: ExamId[]) {
    if (!!exams) {
      this._examRows = exams.map(exam => {
        return {
          id: exam.id,
          course: exam.course,
          year: this.yearPipe.transform(exam.moed),
          semester: this.semesterPipe.transform(exam.moed),
          moed: this.moedPipe.transform(exam.moed),
          questions: this.db.getQuestionsOfExam(exam.course, exam.id)
        } as ExamRow;
      });
    } else {
      this._examRows = null;
    }
    this.updateExams();
  }
  @Input() title = 'Exams';

  private _examRows: ExamRow[];
  public dataSource = new MatTableDataSource<ExamRow>(this._examRows);
  public columnsToDisplay = ['year', 'semester', 'moed'];
  public expandedExam: ExamRow | null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private yearPipe: YearPipe, private semesterPipe: SemesterPipe, private moedPipe: MoedPipe, private db: DbService) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  sortExams(sort: Sort) {
    const data = this.dataSource.data;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      for (const col of this.columnsToDisplay) {
        if (sort.active === col) {
          return this.compare(a[col], b[col], isAsc);
        }
      }
      return 0;
    });
  }

  updateExams() {
    if (this._examRows) {
      this.dataSource.data = this._examRows;
      this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource.data = [];
      this.dataSource.paginator = null;
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
  }
}


