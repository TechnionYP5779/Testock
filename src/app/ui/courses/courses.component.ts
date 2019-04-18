import {Component, OnInit} from '@angular/core';
import {DbService} from '../../core/db.service';
import {Course} from '../../entities/course';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {

  courses: Course[];
  term: any;
  route: ActivatedRoute;
  router: Router;

  constructor(private rtr: Router, private r: ActivatedRoute, private db: DbService) {
    this.route = r;
    this.router = rtr;
  }

  ngOnInit() {
    combineLatest(this.route.params, this.db.courses).subscribe(pair => {
      this.term = pair[0]['term'];
      this.courses = pair[1].filter(course => {
        if (this.term === undefined) {
          return true;
        } else {
          return course.id.toString().includes(this.term) || course.name.toLowerCase().includes(this.term.toString().toLowerCase());
        }
      });
      if (this.courses.length === 1) {
        this.router.navigate(['../course/' + this.courses[0].id]);
      }
    });
  }
}
