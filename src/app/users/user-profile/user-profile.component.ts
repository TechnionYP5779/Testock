import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {UserData} from '../../entities/user';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question} from '../../entities/question';
import {Sort} from '@angular/material';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$: Observable<UserData>;
  userId: string;
  questions: Question[];
  isMyProfile: boolean;

  constructor(public auth: AuthService, private db: DbService, private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('uid');
    this.user$ = this.userId ? this.db.getUser(this.userId) : this.auth.user$;
    this.isMyProfile = (this.userId === null);
  }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(): void {
    this.db.getSolvedQuestionsAsQuestions(this.auth.currentUserId).subscribe(questions => this.questions = questions);
  }

  sortQuestions(sort: Sort) {
    const data = this.questions;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.questions = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'course': return compare(a.course, b.course, isAsc);
        case 'year': return compare(a.year, b.year, isAsc);
        case 'semester': return compare(a.semester, b.semester, isAsc);
        case 'moed': return compare(a.moed, b.moed, isAsc);
        case 'number': return compare(a.number, b.number, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}
