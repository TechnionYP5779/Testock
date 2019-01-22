import { Component, OnInit } from '@angular/core';
import {Course} from '../../core/entities/course';
import {DbService} from '../../core/db.service';
import {ActivatedRoute} from '@angular/router';
import {Faculty, FacultyId} from '../../core/entities/faculty';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  public faculty: FacultyId;
  public courses: Course[];
  public id: string;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getFaculty();
    this.getCourses();
  }

  private getCourses(): void {
    this.db.getCoursesOfFaculty(this.id).subscribe(courses => this.courses = courses);
  }

  private getFaculty(): void {
    this.db.getFaculty(this.id).subscribe(faculty => this.faculty = faculty);
  }
}
