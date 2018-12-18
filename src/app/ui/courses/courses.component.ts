import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {Course} from '../../core/entities/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[];

  constructor(private db: DbService) { }

  ngOnInit() {
    this.db.courses.subscribe(crss => this.courses = crss);
  }

}
