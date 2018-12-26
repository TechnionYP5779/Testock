import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {Course} from '../../core/entities/course';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {

  courses: Course[];
  term: any;
  userSubscription: Subscription;
  route: ActivatedRoute;

  constructor(private r: ActivatedRoute, private db: DbService) {
    this.route = r;
  }

  ngOnInit() {

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.term = params['term'];

        this.db.courses.subscribe(crss => this.courses = crss.filter(course => {
          if (this.term === undefined) {
            return true;
          } else {
            console.log(this.term.toString());
            return course.id.toString().includes(this.term);
          }
        }));
      });
  }
}
