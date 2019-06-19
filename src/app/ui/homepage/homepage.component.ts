import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../../users/auth.service';
import {Course} from '../../entities/course';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  favoriteCourses$: Observable<Course[]>;

  constructor(private db: DbService, public auth: AuthService, private spinner: NgxSpinnerService) {
    this.favoriteCourses$ = this.auth.user$.pipe(
      switchMap(userData => this.db.getFavoriteCourses(userData)),
      map(courses => courses.sort((c1, c2) => (c1.name < c2.name) ? -1 : 1))
    );
  }

  ngOnInit() {
  }

  login() {
    this.auth.login();
  }
}
