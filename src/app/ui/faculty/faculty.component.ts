import {Component, OnInit} from '@angular/core';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {ActivatedRoute} from '@angular/router';
import {FacultyId} from '../../entities/faculty';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss']
})
export class FacultyComponent implements OnInit {

  public faculty$: Observable<FacultyId>;
  public courses$: Observable<Course[]>;
  public id: string;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private db: DbService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.faculty$ = this.db.getFaculty(this.id);
    this.courses$ = this.db.getCoursesOfFaculty(this.id);
  }
}
