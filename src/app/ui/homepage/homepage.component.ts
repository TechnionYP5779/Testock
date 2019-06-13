import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../../users/auth.service';
import {Course} from '../../entities/course';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  favoriteCourses$: Observable<Course[]>;

  constructor(private db: DbService, private auth: AuthService) {
    this.favoriteCourses$ = this.auth.user$.pipe(flatMap(userData => this.db.getFavoriteCourses(userData)));
  }

  ngOnInit() {
  }

}
