import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {combineLatest, Observable, of} from 'rxjs';
import {UserData} from '../../entities/user';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question} from '../../entities/question';
import { Sort } from '@angular/material/sort';
import {Course} from '../../entities/course';
import {map, switchMap} from 'rxjs/operators';
import {FacultyId} from '../../entities/faculty';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$: Observable<UserData>;
  facultyAdmin$: Observable<FacultyId[]>;
  userId: string;
  questions: Question[];
  isMyProfile: boolean;
  favoriteCourses$: Observable<Course[]>;

  constructor(public auth: AuthService, private db: DbService, private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('uid');
    this.user$ = this.userId ? this.db.getUser(this.userId) : this.auth.user$;
    this.isMyProfile = (this.userId === null);
    this.favoriteCourses$ = this.user$.pipe(
      switchMap(user => this.db.getFavoriteCourses(user)),
      map(courses => courses.sort((c1, c2) => (c1.name < c2.name) ? -1 : 1))
    );
    this.facultyAdmin$ = this.user$.pipe(switchMap(userdata => {
      if (!userdata.roles.faculty_admin) { return of(null); }
      return combineLatest(userdata.roles.faculty_admin.map(facId => this.db.getFaculty(facId)));
    }));
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
        case 'year': return compare(a.moed.semester.year, b.moed.semester.year, isAsc);
        case 'semester': return compare(a.moed.semester.num, b.moed.semester.num, isAsc);
        case 'moed': return compare(a.moed.num, b.moed.num, isAsc);
        case 'number': return compare(a.number, b.number, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? -1 : 1);
}
