import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {combineLatest, Observable} from 'rxjs';
import {UserData} from '../../entities/user';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';
import {Question} from '../../entities/question';
import {Sort} from '@angular/material';
import {Course} from '../../entities/course';
import {flatMap, map} from 'rxjs/operators';
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
      flatMap(user => this.db.getFavoriteCourses(user)),
      map(courses => courses.sort((c1, c2) => (c1.name < c2.name) ? -1 : 1))
    );
    this.facultyAdmin$ = this.user$.pipe(flatMap(userdata => {
      if (!userdata.roles.faculty_admin) { return null; }
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
