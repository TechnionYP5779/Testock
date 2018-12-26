import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {Course} from '../../core/entities/course';
import {ActivatedRoute, Params} from '@angular/router';
import {zip} from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {

  courses: Course[];
  term: any;
  route: ActivatedRoute;

  constructor(private r: ActivatedRoute, private db: DbService) {
    this.route = r;
  }

  ngOnInit() {
    zip(this.route.params, this.db.courses, (params: Params, crss: Course[]) => ({params, crss})).subscribe(pair => {
      this.term = pair.params['term'];
      this.courses = pair.crss.filter(course => {
        if (this.term === undefined) {
          return true;
        } else {
          console.log(this.term.toString());
          return course.id.toString().includes(this.term);
        }
      });
    });
  }
}
