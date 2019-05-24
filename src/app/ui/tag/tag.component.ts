import { Component, OnInit } from '@angular/core';
import {Sort} from '@angular/material';
import {QuestionId} from '../../entities/question';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {AuthService} from '../../users/auth.service';
import {Course} from '../../entities/course';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  public questions$: Observable<QuestionId[]>;
  public course$: Observable<Course>;
  private courseID: number;
  public tag: string;
  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService, private auth: AuthService) {
    this.courseID = +this.route.snapshot.paramMap.get('cid');
    this.tag = this.route.snapshot.paramMap.get('tag');
    this.questions$ = this.db.getQuestionsOfCourseWithTag(this.courseID, this.tag);
    this.course$ = this.db.getCourse(this.courseID);
  }

  ngOnInit() {

  }

  sortQuestions(sort: Sort) {
    this.questions$.subscribe(questions => {
      const data = questions;
      if (!sort.active || sort.direction === '') {
        return;
      }
      this.questions$ = Observable.create(data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'year':
            return compare(a.year, b.year, isAsc);
          case 'semester':
            return compare(a.semester, b.semester, isAsc);
          case 'moed':
            return compare(a.moed, b.moed, isAsc);
          case 'number':
            return compare(a.number, b.number, isAsc);
          // TODO: case 'difficulty': return compare(a.difficulty, b.difficulty, isAsc);
          // TODO: case 'is_solved': return compare(a.is_solved, b.is_solved, isAsc);
          default:
            return 0;
        }
      }));
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}



